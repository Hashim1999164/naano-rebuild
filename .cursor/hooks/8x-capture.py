#!/usr/bin/env python3
"""8x assignment capture: prompt + final response only."""
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LOG_DIR = ROOT / ".agent-logs"
SESSION_ID = "8x-naano-20260911"
LOG_PATH = LOG_DIR / "2026-09-11_10-35-00_8x-naano-20260911.md"
DUMP_DIR = LOG_DIR / "_raw"
MODEL = "cursor-grok-4.6"
TOOL = "cursor"


def utc_now():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def load_stdin():
    raw = sys.stdin.read()
    DUMP_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%f")
    (DUMP_DIR / f"{stamp}.json").write_text(raw, encoding="utf-8")
    try:
        return json.loads(raw) if raw.strip() else {}
    except json.JSONDecodeError:
        return {"_raw": raw}


def ensure_header():
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    if LOG_PATH.exists():
        return
    LOG_PATH.write_text(
        f"""---
session_id: {SESSION_ID}
date: 2026-09-11
author: Hashim1999164
model: {MODEL}
tool: {TOOL}
project: naano-rebuild
total_exchanges: 0
first_prompt_time: {utc_now()}
last_prompt_time: {utc_now()}
---

# Session Log - 2026-09-11

Session: `{SESSION_ID}` | Project: `naano-rebuild` | Author: `Hashim1999164`

""",
        encoding="utf-8",
    )


def next_num(kind: str) -> int:
    text = LOG_PATH.read_text(encoding="utf-8") if LOG_PATH.exists() else ""
    return text.count(f"[LOG_ENTRY type={kind}") + 1


def pick_text(data: dict, keys):
    for key in keys:
        val = data.get(key)
        if isinstance(val, str) and val.strip():
            return val
        if isinstance(val, dict):
            nested = pick_text(val, keys)
            if nested:
                return nested
        if isinstance(val, list):
            parts = []
            for item in val:
                if isinstance(item, str):
                    parts.append(item)
                elif isinstance(item, dict):
                    t = pick_text(item, keys)
                    if t:
                        parts.append(t)
            if parts:
                return "\n".join(parts)
    return ""


def append_entry(kind: str, body: str, data: dict):
    ensure_header()
    num = next_num(kind)
    ts = data.get("timestamp") or utc_now()
    model = data.get("model") or MODEL
    body = (body or json.dumps(data, indent=2)[:8000]).rstrip() + "\n"
    with LOG_PATH.open("a", encoding="utf-8") as f:
        f.write(
            f"""
[LOG_ENTRY type={kind} num={num} session={SESSION_ID[:8]}]
timestamp: {ts}
model: {model}

{body}

"""
        )


def main():
    data = load_stdin()
    event = (
        data.get("hook_event_name")
        or data.get("event")
        or data.get("conversation_status")
        or ""
    )
    text = pick_text(
        data,
        [
            "prompt",
            "user_prompt",
            "text",
            "content",
            "message",
            "response",
            "agent_message",
            "final_response",
            "completion",
        ],
    )
    name = " ".join(str(event).split()).lower()
    if "prompt" in name or "submit" in name:
        append_entry("PROMPT", text, data)
    elif "response" in name or "stop" in name or "thought" in name:
        if "thought" in name or not text:
            sys.stdout.write("{}\n")
            return
        append_entry("RESPONSE", text, data)
    else:
        # Unknown payload: keep it so we can fix the hook, still fail open.
        append_entry("PROMPT" if text and len(text) < 4000 else "RESPONSE", text, data)
    sys.stdout.write("{}\n")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        sys.stderr.write(str(exc) + "\n")
        sys.stdout.write("{}\n")
        sys.exit(0)
