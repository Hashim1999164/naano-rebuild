"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, useAccount } from "@/lib/client";

type Collab = { id:string; brand:string; title:string; brief:string; fee:number; status:string; ready:boolean };

export default function CreatorDashboard(){
 const {account,refresh}=useAccount();
 const [price,setPrice]=useState(account?.price||180);
 const [collabs,setCollabs]=useState<Collab[]>([]);
 const first=account?.name.split(" ")[0]||"Thomas";
 const initials=account?.initials||"TH";

 useEffect(()=>{
   if(account?.price) setPrice(account.price);
   fetch("/api/save").then(r=>r.json()).then(d=>{ if(d.collabs) setCollabs(d.collabs); }).catch(()=>{});
 },[account]);

 const savePrice=async(value:number)=>{
   setPrice(value);
   await api("/api/save",{kind:"collab",price:value});
   await refresh();
 };

 const act=async(id:string, patch:Record<string,unknown>)=>{
   const data=await api<{collabs:Collab[]}>("/api/save",{kind:"collab",id,...patch});
   if(data.collabs) setCollabs(data.collabs);
 };

 return <main className="min-h-screen bg-[#f8f8f7]">
  <header className="flex h-[74px] items-center justify-between border-b border-[#e8e8e8] bg-white px-6 md:px-10">
    <Link href="/" className="naano-logo"><span className="logo-mark"><i/></span>naano <small className="rounded-full bg-[#eef1ff] px-2 py-1 text-[10px] tracking-normal text-[#315cff]">CREATOR</small></Link>
    <div className="flex items-center gap-3">
      <Link className="text-sm text-[#666]" href="/app">Brand view</Link>
      <a href="/data/db.json" target="_blank" rel="noreferrer" className="wallet-chip">JSON</a>
      <button className="btn-white !px-3 !py-2 text-xs" onClick={async()=>{await api("/api/auth/logout",{}); await refresh(); location.href="/login"}}>Log out</button>
      <div className="grid h-9 w-9 place-items-center rounded-full bg-black text-xs text-white">{initials}</div>
    </div>
  </header>
  <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} className="mx-auto max-w-[1180px] px-5 py-10">
    <div className="flex flex-col justify-between gap-4 sm:flex-row">
      <div><p className="eyebrow">Creator dashboard</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Good morning, {first}</h1><p className="mt-2 text-[#777]">Collaborations are saved in /data/db.json.</p></div>
      <div className="card flex items-center gap-4 px-5 py-3"><span><small className="block text-[#777]">Your post price</small><b className="text-xl">€{price}</b></span><input aria-label="Price" type="range" min="20" max="420" step="20" value={price} onChange={e=>savePrice(Number(e.target.value))}/></div>
    </div>
    <div className="mt-8 grid gap-4 sm:grid-cols-3">{[["€"+((account?.wallet)||1240),"Earnings this month"],["€860","Scheduled payouts"],["94%","On-time delivery"]].map((x,i)=><motion.div className="card p-6" key={x[1]} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.08}}><b className="text-3xl">{x[0]}</b><p className="mt-2 text-sm text-[#777]">{x[1]}</p></motion.div>)}</div>
    <h2 className="mt-10 text-xl font-semibold">Incoming collaborations</h2>
    <div className="mt-4 grid gap-4">
      {(collabs.length?collabs:[{id:"c1",brand:"Acme",title:"Q4 Revenue Playbook",brief:"Share a practical lesson about finding hidden revenue signals in your pipeline.",fee:320,status:"Draft due Sep 15",ready:false}]).map(c=>(
        <div className="card p-6" key={c.id}>
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div><span className="status">{c.status}</span><h3 className="mt-3 text-lg font-semibold">{c.brand} · {c.title}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-[#666]">{c.brief}</p></div>
            <div className="shrink-0"><p className="text-xs text-[#777]">YOUR FEE</p><b className="text-2xl">€{c.fee}</b></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 border-t border-[#eee] pt-5">
            {c.status.includes("invitation") || c.status==="New invitation" ? <>
              <button className="btn-white" onClick={()=>act(c.id,{decline:true})}>Decline</button>
              <button className="btn-black !rounded-xl" onClick={()=>act(c.id,{accept:true})}>Accept collaboration</button>
            </> : <>
              <button className="btn-white">View brief</button>
              <button onClick={()=>act(c.id,{ready:true})} className="btn-black !rounded-xl">{c.ready?"Draft ready ✓":"Mark draft ready"}</button>
            </>}
          </div>
        </div>
      ))}
    </div>
    <h2 className="mt-10 text-xl font-semibold">Payouts</h2>
    <div className="card mt-4 overflow-hidden"><table className="table"><thead><tr><th>Brand</th><th>Post</th><th>Status</th><th>Payout date</th><th>Amount</th></tr></thead><tbody><tr><td>Lemlist</td><td>Outbound that feels human</td><td><span className="status">Scheduled</span></td><td>Sep 18</td><td><b>€260</b></td></tr><tr><td>Ringover</td><td>The new sales stack</td><td><span className="status">Paid</span></td><td>Sep 3</td><td><b>€300</b></td></tr></tbody></table></div>
  </motion.div>
 </main>
}
