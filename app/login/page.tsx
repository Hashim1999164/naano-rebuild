"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/client";

function LoginForm(){
  const [email,setEmail]=useState("hashim@acme.com");
  const [password,setPassword]=useState("demo");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const router=useRouter();
  const next=useSearchParams().get("next");

  return <main className="clouds flex min-h-screen items-center justify-center px-5 py-12">
    <motion.div initial={{opacity:0,y:24,scale:.98}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.5,ease:[.22,1,.36,1]}} className="w-full max-w-[450px] rounded-[24px] border border-white bg-white/95 p-8 shadow-xl shadow-blue-900/5 sm:p-11">
      <Link href="/" className="naano-logo justify-center"><span className="logo-mark"><i/></span>naano</Link>
      <h1 className="mt-10 text-center text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-center text-sm text-[#777]">Sign in to manage creator campaigns.</p>
      <form className="mt-8 grid gap-4" onSubmit={async e=>{
        e.preventDefault(); setError(""); setBusy(true);
        try {
          const data = await api<{user:{role:string}}>("/api/auth/login", {email, password});
          router.push(next || (data.user.role==="creator"?"/creator":"/app"));
          router.refresh();
        } catch(err) {
          setError(err instanceof Error ? err.message : "Could not sign in");
        } finally { setBusy(false); }
      }}>
        <label className="text-sm font-medium">Email<input className="field mt-2" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
        <label className="text-sm font-medium">Password<input className="field mt-2" type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
        {error && <p className="rounded-xl bg-[#fff1f1] px-3 py-2 text-sm text-[#b42318]">{error}</p>}
        <button className="btn-black mt-2 w-full !rounded-xl !py-3.5" disabled={busy}>{busy?"Signing in…":"Sign in →"}</button>
      </form>
      <p className="mt-5 rounded-xl bg-[#f5f5f5] p-3 text-center text-xs text-[#68686d]">Saved on the server in /data/db.json · hashim@acme.com / demo · creator@naano.com / demo</p>
      <p className="mt-7 text-center text-sm text-[#777]">New to naano? <Link className="font-semibold text-black" href="/register">Create account</Link></p>
    </motion.div>
  </main>
}

export default function Login(){
  return <Suspense><LoginForm/></Suspense>
}
