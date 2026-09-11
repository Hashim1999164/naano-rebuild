"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { demoLogin } from "@/lib/store";

export default function Login(){
  const [email,setEmail]=useState("hashim@acme.com");
  const [password,setPassword]=useState("demo");
  const router=useRouter();
  return <main className="clouds flex min-h-screen items-center justify-center px-5 py-12"><div className="w-full max-w-[450px] rounded-[24px] border border-white bg-white/95 p-8 shadow-xl shadow-blue-900/5 sm:p-11">
    <Link href="/" className="naano-logo justify-center"><span className="logo-mark"><i/></span>naano</Link>
    <h1 className="mt-10 text-center text-3xl font-semibold tracking-tight">Welcome back</h1>
    <p className="mt-2 text-center text-sm text-[#777]">Sign in to manage creator campaigns.</p>
    <form className="mt-8 grid gap-4" onSubmit={e=>{e.preventDefault();const account=demoLogin(email);router.push(account.role==="creator"?"/creator":"/app")}}>
      <label className="text-sm font-medium">Email<input className="field mt-2" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
      <label className="text-sm font-medium">Password<input className="field mt-2" type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
      <button className="btn-black mt-2 w-full !rounded-xl !py-3.5">Sign in →</button>
    </form>
    <p className="mt-5 rounded-xl bg-[#f5f5f5] p-3 text-center text-xs text-[#68686d]">Demo: hashim@acme.com / demo · creator@naano.com for the creator side · any password works</p>
    <p className="mt-7 text-center text-sm text-[#777]">New to naano? <Link className="font-semibold text-black" href="/register">Create account</Link></p>
  </div></main>
}
