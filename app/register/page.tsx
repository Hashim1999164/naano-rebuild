"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api, useAccount } from "@/lib/client";

function RegisterForm() {
  const [role,setRole]=useState<"brand"|"creator"|null>(null);
  const [mode,setMode]=useState<"oauth"|"form"|"code">("oauth");
  const [code,setCode]=useState("");
  const [sent,setSent]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [form,setForm]=useState({first:"",last:"",email:"",password:"",source:"LinkedIn"});
  const router=useRouter();
  const {refresh}=useAccount();

  const submit=async (e:React.FormEvent)=>{
    e.preventDefault(); setError(""); setBusy(true);
    try {
      if(mode==="form"){
        const data=await api<{code:string}>("/api/auth/register",{...form,role});
        setSent(data.code); setMode("code"); return;
      }
      await api("/api/auth/register",{email:form.email,code},"PUT");
      await refresh();
      router.push(role==="creator"?"/creator":"/app");
    } catch(err) {
      setError(err instanceof Error ? err.message : "Could not continue");
    } finally { setBusy(false); }
  };

  return <main className="grid min-h-screen lg:grid-cols-2">
    <section className="flex min-h-screen flex-col px-7 py-7 sm:px-14 lg:px-20">
      <Link href="/" className="naano-logo"><span className="logo-mark"><i/></span>naano</Link>
      <div className="mx-auto flex w-full max-w-[500px] flex-1 flex-col justify-center py-12">
        <AnimatePresence mode="wait">
          {!role ? <motion.div key="pick" initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:16}}>
            <p className="eyebrow">Join naano</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-.04em]">How will you use naano?</h1>
            <p className="mt-3 text-[#6d6d72]">Companies book LinkedIn creators. Creators get paid per post.</p>
            <div className="mt-9 grid gap-4">
              <button onClick={()=>setRole("creator")} className="card flex items-center gap-5 p-5 text-left hover:border-black"><span className="rounded-2xl bg-[#f1edff] p-4 text-2xl">✦</span><span><b className="block text-lg">I&apos;m a creator</b><small className="mt-1 block text-[#6d6d72]">Find paid collaborations with B2B brands</small></span><span className="ml-auto text-xl">→</span></button>
              <button onClick={()=>setRole("brand")} className="card flex items-center gap-5 p-5 text-left hover:border-black"><span className="rounded-2xl bg-[#e8eeff] p-4 text-2xl">◼</span><span><b className="block text-lg">I&apos;m a brand</b><small className="mt-1 block text-[#6d6d72]">Launch creator campaigns that drive pipeline</small></span><span className="ml-auto text-xl">→</span></button>
            </div>
          </motion.div> : <motion.div key={mode} initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-18}}>
            <button type="button" onClick={()=>{if(mode==="oauth")setRole(null);else if(mode==="form")setMode("oauth");else setMode("form")}} className="mb-8 text-sm text-[#6d6d72]">← Back</button>
            {mode==="oauth" && <>
              <p className="eyebrow">Create your account</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-.04em]">Join Naano</h1>
              <p className="mt-3 text-[#6d6d72]">Signing up as a {role}.</p>
              <div className="mt-8 grid gap-3">
                <button type="button" onClick={()=>setMode("form")} className="btn-white !rounded-xl !py-3.5 w-full">Continue with LinkedIn</button>
                <button type="button" onClick={()=>setMode("form")} className="btn-white !rounded-xl !py-3.5 w-full">Continue with Google</button>
                <button type="button" onClick={()=>setMode("form")} className="btn-black w-full !rounded-xl !py-3.5">Continue with email</button>
              </div>
            </>}
            {mode!=="oauth" && <form onSubmit={submit}>
              {mode==="form" ? <>
                <p className="eyebrow">Your details</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-.04em]">Create your {role} account</h1>
                <div className="mt-8 grid gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input className="field" required placeholder="First name" value={form.first} onChange={e=>setForm({...form,first:e.target.value})}/>
                    <input className="field" required placeholder="Last name" value={form.last} onChange={e=>setForm({...form,last:e.target.value})}/>
                  </div>
                  <input className="field" required type="email" placeholder="Business email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                  <input className="field" required type="password" minLength={4} placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
                  <div>
                    <p className="mb-3 text-sm font-medium">How did you hear about us?</p>
                    <div className="flex flex-wrap gap-2">{["LinkedIn","A friend","Google","Podcast","Event","Other"].map(x=><button type="button" onClick={()=>setForm({...form,source:x})} className={`chip ${form.source===x?"active":""}`} key={x}>{x}</button>)}</div>
                  </div>
                </div>
                <button className="btn-black mt-7 w-full !rounded-xl !py-3.5" disabled={busy}>{busy?"Sending code…":"Send verification code"}</button>
              </> : <>
                <p className="eyebrow">Email verification</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-.04em]">Enter the 6-digit code</h1>
                <p className="mt-3 text-sm text-[#6d6d72]">We saved a code for {form.email} in /data/db.json.</p>
                {sent && <p className="mt-4 rounded-xl bg-[#eef1ff] px-4 py-3 text-sm">Your code is <b className="tracking-[0.3em]">{sent}</b></p>}
                <input className="field mt-8 tracking-[0.4em] text-center text-2xl" inputMode="numeric" maxLength={6} required value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="000000"/>
                <button className="btn-black mt-7 w-full !rounded-xl !py-3.5" disabled={busy}>{busy?"Verifying…":"Verify and enter naano →"}</button>
              </>}
            </form>}
          </motion.div>}
        </AnimatePresence>
        {error && <p className="mt-5 rounded-xl bg-[#fff1f1] px-3 py-2 text-sm text-[#b42318]">{error}</p>}
        <p className="mt-7 text-center text-sm text-[#777]">Already have an account? <Link className="font-semibold text-black" href="/login">Sign in</Link></p>
      </div>
    </section>
    <aside className="hidden bg-[#315cff] p-16 text-white lg:flex lg:flex-col lg:justify-between">
      <p className="text-sm font-semibold">Creator-led growth, end to end.</p>
      <div>
        <div className="mb-8 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/15 p-5"><b className="text-3xl">15k+</b><small className="mt-2 block text-white/70">vetted creators</small></div>
          <div className="rounded-2xl bg-white/15 p-5"><b className="text-3xl">€20</b><small className="mt-2 block text-white/70">posts from</small></div>
          <div className="rounded-2xl bg-white/15 p-5"><b className="text-3xl">4 days</b><small className="mt-2 block text-white/70">to launch</small></div>
        </div>
        <blockquote className="text-3xl font-medium leading-[1.25] tracking-tight">“Naano helped us turn trusted industry voices into our highest-converting channel.”</blockquote>
        <p className="mt-6 text-sm text-white/65">Vincent Josse · CEO, BlogSEO</p>
      </div>
    </aside>
  </main>
}

export default function Register() {
  return <Suspense><RegisterForm/></Suspense>
}
