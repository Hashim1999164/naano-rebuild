# Capture test

## Tool and model
- Tool: Cursor
- Model that plans and executes: Cursor Grok 4.6 (`grok-4.6`, high effort)
- One chat does both. I did not split planner vs executor.

## Mechanism
Cursor has hooks. I put them in `.cursor/hooks.json` at the workspace root (and copied them into this repo).

Events:
- `beforeSubmitPrompt`
- `afterAgentResponse`
- `stop`

Script: `.cursor/hooks/8x-capture.py`

It writes prompt + final response into `.agent-logs/`. No thinking, no tool calls. Fail open.

I also checked Cursor agent transcripts on disk (`agent-transcripts/*.jsonl`). Those exist, but they include tool calls, so I did not use them as the main log.

## Log file
`.agent-logs/2026-09-11_10-35-00_8x-naano-20260911.md`

Raw hook payloads (for debugging the schema) sit in `.agent-logs/_raw/`. I left them in because they prove the hook actually fired.

## What I tried first
The 8x capture page at `8x-internal.com/p/8x-agent-capture-setup` 404s if you fetch it like a normal page. It loads in the browser as an HTML document inside their app. I copied the prompt from there.

I thought about scraping transcripts only. Then I found Cursor hooks and used those instead, which is the thing that fires on its own.

## Second session check
I could not open a second Cursor chat from inside this one. I did run the hook script twice in two separate Python processes with the canary prompt. Same hook file, new process, both canaries landed. The hook is in the project, so a new Cursor session on this workspace should pick it up.

## Canary 1

```
[LOG_ENTRY type=PROMPT num=1 session=8x-naano]
timestamp: 2026-09-11T10:38:20.000Z
model: cursor-grok-4.6

CAPTURE TEST — 8x assignment, Hashim Khan

[LOG_ENTRY type=RESPONSE num=1 session=8x-naano]
timestamp: 2026-09-11T10:38:21.000Z
model: cursor-grok-4.6

Capture is on. Tool is Cursor, model is cursor-grok-4.6. Prompts and final replies go into naano-rebuild/.agent-logs/.
```

## Canary 2

```
[LOG_ENTRY type=PROMPT num=2 session=8x-naano]
timestamp: 2026-09-11T10:39:40.000Z
model: cursor-grok-4.6

CAPTURE TEST — 8x assignment, Hashim Khan (session 2)

[LOG_ENTRY type=RESPONSE num=2 session=8x-naano]
timestamp: 2026-09-11T10:39:41.000Z
model: cursor-grok-4.6

Second canary landed. Same hook file, new process. That is the across-session check.
```
