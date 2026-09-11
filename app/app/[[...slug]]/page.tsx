"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { avatar, campaigns as seedCampaigns, creators, trackingRows } from "@/lib/data";
import { api, useAccount } from "@/lib/client";

const nav=[
  ["/app","▦","Overview"],
  ["/app/creators","⌕","Creators"],
  ["/app/campaigns","◫","Campaigns"],
  ["/app/collaborations","⇄","Collaborations"],
  ["/app/tracking","↗","Results"],
  ["/app/messages","✉","Messages"],
  ["/app/billing","€","Billing"],
];

function Shell({children,title,action}:{children:React.ReactNode,title:string,action?:React.ReactNode}){
  const path=usePathname();
  const {account,refresh}=useAccount();
  const router=useRouter();
  const active=(href:string)=>path===href||(href!=="/app"&&path.startsWith(href));
  const company=account?.company||"Acme";
  const initials=account?.initials||"HK";
          const wallet=(account?.wallet??2480).toLocaleString("en-GB",{minimumFractionDigits:2,maximumFractionDigits:2});
  return <div className="app-shell">
    <aside className="icon-rail">
      <Link href="/" className="mb-4 grid h-10 w-10 place-items-center"><span className="logo-mark"><i/></span></Link>
      {nav.map(n=><Link href={n[0]} key={n[0]} title={n[2]} className={`rail-link ${active(n[0])?"active":""}`}>{n[1]}</Link>)}
      <Link href="/creator" title="Creator view" className="rail-link mt-auto">⇄</Link>
    </aside>
    <div className="app-main">
      <header className="topbar">
        <div><p className="text-xs text-[#888]">{company} workspace</p><h1 className="text-xl font-semibold tracking-tight">{title}</h1></div>
        <div className="flex items-center gap-3">
          <a href="/data/db.json" target="_blank" rel="noreferrer" className="wallet-chip">JSON</a>
          <span className="wallet-chip">€{wallet}</span>
          <span className="wallet-chip">EN</span>
          {action||<Link href="/app/campaigns/new" className="btn-blue !py-2.5 text-sm">+ New campaign</Link>}
          <button className="btn-white !px-3 !py-2 text-xs" onClick={async()=>{await api("/api/auth/logout",{}); await refresh(); router.push("/login")}}>Log out</button>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#111] text-xs text-white">{initials}</div>
        </div>
      </header>
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35}}>
        {children}
      </motion.div>
      <nav className="mobile-nav">
        {nav.slice(0,5).map(n=><Link key={n[0]} href={n[0]} className={active(n[0])?"active":""}>{n[2]}</Link>)}
      </nav>
    </div>
  </div>
}

function Overview(){
  const {account}=useAccount();
  const first=account?.name.split(" ")[0]||"Hashim";
  const full=account?.name||"Hashim Khan";
  return <Shell title="Overview">
    <div className="page">
      <p className="text-sm text-[#888]">Hello {first}</p>
      <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h2 className="max-w-3xl text-3xl font-semibold tracking-[-.03em] sm:text-4xl">Here is what is happening for {full} on Naano.</h2>
        <Link href="/app/campaigns/new" className="btn-blue shrink-0">+ New campaign</Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Creators activated","9"],["Posts published","14"],["Profiles engaged","2,184"],["Impressions","138.1k"]].map(x=>(
          <div className="card metric" key={x[0]}><p className="text-sm text-[#777]">{x[0]}</p><b className="mt-3 block text-3xl tracking-tight">{x[1]}</b></div>
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between"><div><h3 className="font-semibold">To do</h3><p className="mt-1 text-xs text-[#888]">Priority actions</p></div><Link href="/app/creators" className="text-sm font-semibold text-[#315cff]">See all</Link></div>
          <div className="mt-2">
            {[["Approve Thomas Higadère draft","Due today","suggested"],["Top up your wallet","€320 remaining on Q4","blocked"],["Book creators for Spring launch","6 shortlisted","suggested"]].map(x=>(
              <div className="todo-row" key={x[0]}>
                <span className="grid h-5 w-5 place-items-center rounded-full border border-[#ddd] text-[10px]">○</span>
                <div className="flex-1"><p className="font-medium">{x[0]}</p><p className="text-xs text-[#888]">{x[1]}</p></div>
                <span className={`badge ${x[2]==="blocked"?"badge-blocked":"badge-suggested"}`}>{x[2]==="blocked"?"Blocked":"Suggested"}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card overflow-hidden">
          <div className="clouds px-6 py-5"><div className="flex items-center justify-between"><p className="text-xs font-bold tracking-wide text-[#5b6aa8]">NEW CREATORS</p><Link href="/app/creators" className="text-sm font-semibold text-[#315cff]">Explore</Link></div><h3 className="mt-2 text-xl font-semibold">Profiles that fit your buyers</h3></div>
          <div className="p-4">{creators.slice(0,3).map(c=>(
            <Link href={`/app/creators/${c.id}`} key={c.id} className="flex items-center gap-3 rounded-xl p-2 hover:bg-[#f7f7f7]">
              <img src={avatar(c.name)} alt="" className="h-10 w-10 rounded-full bg-[#eef1ff]"/>
              <div className="flex-1"><b className="block text-sm">{c.name}</b><small className="text-[#777]">{c.vertical} · €{c.price}</small></div>
              <span className="text-xs font-bold text-[#315cff]">{c.fit}%</span>
            </Link>
          ))}</div>
        </div>
      </div>
      <div className="card mt-5 p-6">
        <h3 className="font-semibold">Messages</h3>
        <p className="mt-1 text-xs text-[#888]">Waiting on your reply</p>
        <div className="mt-4 grid gap-3">{[["Thomas Higadère","Draft is ready for Q4 Revenue Playbook"],["Naano team","Want a strategist on the Spring launch?"]].map(x=>(
          <Link href="/app/messages" key={x[0]} className="flex items-center justify-between rounded-xl border border-[#eee] p-4 hover:border-[#ccc]"><span><b>{x[0]}</b><small className="mt-1 block text-[#777]">{x[1]}</small></span><span>→</span></Link>
        ))}</div>
      </div>
    </div>
  </Shell>
}

function Discover(){
  const [search,setSearch]=useState(""); const [vertical,setVertical]=useState("All"); const [tier,setTier]=useState("All");
  const shown=useMemo(()=>creators.filter(c=>(vertical==="All"||c.vertical===vertical)&&(tier==="All"||(tier==="Micro"&&c.followers<10000)||(tier==="Mid"&&c.followers>=10000&&c.followers<30000)||(tier==="Top"&&c.followers>=30000))&&(c.name+" "+c.title).toLowerCase().includes(search.toLowerCase())).sort((a,b)=>b.fit-a.fit),[search,vertical,tier]);
  return <Shell title="Creators" action={<Link href="/app/campaigns/new" className="btn-blue text-sm">+ New campaign</Link>}>
    <div className="page">
      <div className="flex flex-col justify-between gap-3 md:flex-row"><div><h2 className="text-3xl font-semibold tracking-[-.03em]">Find your next trusted voice</h2><p className="mt-2 text-sm text-[#777]">{shown.length} vetted B2B creators ranked for Acme</p></div><div className="rounded-xl bg-[#ecf0ff] px-4 py-3 text-sm text-[#315cff]"><b>AI match</b> · Based on your ICP</div></div>
      <div className="card mt-7 grid gap-3 p-4 md:grid-cols-[1fr_190px_150px]"><input className="field" placeholder="Search by creator, topic or keyword…" value={search} onChange={e=>setSearch(e.target.value)}/><select className="field" value={vertical} onChange={e=>setVertical(e.target.value)}><option>All</option>{["sales","RevOps","devtools","product","HR-tech","fintech","marketing-ops"].map(v=><option key={v}>{v}</option>)}</select><select className="field" value={tier} onChange={e=>setTier(e.target.value)}><option>All</option><option>Micro</option><option>Mid</option><option>Top</option></select></div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{shown.map((c,i)=><motion.div key={c.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.04,duration:.35}}><Link href={`/app/creators/${c.id}`} className="creator-card card block"><div className="relative h-[180px] bg-gradient-to-br from-[#eef1ff] to-[#f4f4f4]"><img src={avatar(c.name)} alt={c.name} className="h-full w-full object-contain pt-4"/><span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#315cff] shadow-sm">{c.fit}% fit</span></div><div className="p-5"><div className="flex items-start justify-between gap-2"><div><h3 className="text-lg font-semibold">{c.name}</h3><p className="mt-1 text-sm text-[#65656a]">{c.title}</p></div><span className="rounded bg-[#0A66C2] px-1.5 py-1 text-xs font-bold text-white">in</span></div><div className="mt-5 flex items-center gap-2 text-xs text-[#777]"><span>{(c.followers/1000).toFixed(1)}k followers</span><span>·</span><span>{c.vertical}</span></div><div className="mt-5 flex items-center justify-between border-t border-[#eee] pt-4"><span><b className="text-lg">€{c.price}</b><small className="text-[#777]"> / post</small></span><span className="btn-black !px-4 !py-2 text-xs">Book →</span></div></div></Link></motion.div>)}</div>
    </div>
  </Shell>
}

function Profile({id}:{id:string}){
  const c=creators.find(x=>x.id===id)||creators[0]; const [booked,setBooked]=useState(false); const [campaignId,setCampaignId]=useState("q4-revenue"); const [busy,setBusy]=useState(false);
  const {refresh}=useAccount();
  return <Shell title="Creator profile">
    <div className="page">
      <Link href="/app/creators" className="text-sm text-[#777]">← Back to creators</Link>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="card flex flex-col gap-6 p-7 sm:flex-row"><div className="h-40 w-40 shrink-0 overflow-hidden rounded-2xl bg-[#eef1ff]"><img src={avatar(c.name)} className="h-full w-full object-cover" alt={c.name}/></div><div><span className="status">{c.fit}% brand fit</span><h2 className="mt-4 text-3xl font-semibold tracking-tight">{c.name}</h2><p className="mt-1 text-[#555]">{c.title}</p><p className="mt-4 text-sm text-[#777]">📍 {c.location} &nbsp; · &nbsp; <b className="text-black">{c.followers.toLocaleString()}</b> LinkedIn followers</p></div></div>
          <section className="card mt-5 p-7"><h3 className="text-lg font-semibold">About</h3><p className="mt-3 leading-7 text-[#626267]">{c.about}</p><h3 className="mt-8 text-lg font-semibold">Audience</h3><p className="mt-3 leading-7 text-[#626267]">{c.audience}</p><div className="mt-8 grid grid-cols-3 gap-3">{[["68%","Decision makers"],["47%","SaaS & tech"],["61%","Europe"]].map(x=><div className="rounded-xl bg-[#f6f6f5] p-4" key={x[1]}><b className="block text-xl">{x[0]}</b><small className="text-[#777]">{x[1]}</small></div>)}</div></section>
          <section className="card mt-5 p-7"><h3 className="text-lg font-semibold">Recent posts</h3>{["Why most GTM teams are measuring the wrong thing","The playbook I wish I had at 10k ARR"].map((x,i)=><div className="mt-4 rounded-xl border border-[#eee] p-5" key={x}><p className="text-xs text-[#0A66C2]">LinkedIn · {i+2} weeks ago</p><p className="mt-3 font-medium">{x}</p><p className="mt-3 text-xs text-[#777]">{(14-i*3)}k impressions · {238-i*41} reactions · {31-i*8} comments</p></div>)}</section>
        </div>
        <aside>
          <div className="card sticky top-6 p-6">
            <p className="eyebrow">Fixed price</p>
            <p className="mt-2 text-4xl font-semibold">€{c.price}<small className="text-sm font-normal text-[#777]"> / LinkedIn post</small></p>
            <ul className="mt-6 grid gap-3 text-sm"><li>✓ One original sponsored post</li><li>✓ One round of revisions</li><li>✓ Tracked link & campaign report</li><li>✓ Creator usage rights for 30 days</li></ul>
            <select className="field mt-6" value={campaignId} onChange={e=>setCampaignId(e.target.value)}><option value="q4-revenue">Q4 Revenue Playbook</option><option value="spring-launch">Spring product launch</option></select>
            <button disabled={busy} onClick={async()=>{setBusy(true); try{await api("/api/save",{kind:"booking",creatorId:c.id,campaignId,fee:c.price}); setBooked(true); await refresh();} finally{setBusy(false)}}} className="btn-black mt-3 w-full !rounded-xl">{booked?"Added to campaign ✓":busy?"Saving…":"Book this creator →"}</button>
            <p className="mt-4 text-center text-xs text-[#888]">You won&apos;t be charged yet</p>
          </div>
        </aside>
      </div>
    </div>
  </Shell>
}

function NewCampaign(){
  const router=useRouter(); const [method,setMethod]=useState<"ai"|"team"|"link"|null>(null); const [loading,setLoading]=useState(false); const [generated,setGenerated]=useState(false);
  const [product,setProduct]=useState("Acme Signals");
  const save=async()=>{
    await api("/api/save",{kind:"campaign",name:`${product} campaign`,product,method:method||"ai",brief:"Position Acme Signals as the fastest way for modern revenue teams to uncover high-intent buying signals and build pipeline.",budget:900});
    router.push("/app/campaigns");
  };
  const generate=()=>{setLoading(true);setTimeout(()=>{setLoading(false);setGenerated(true)},700)};
  return <Shell title="Create campaign">
    <div className="page max-w-[1000px]">
      <p className="eyebrow">Campaign brief builder</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">How do you want to launch your campaign?</h2>
      <p className="mt-2 text-[#777]">Choose your method. You can change everything before launch.</p>
      {!method && <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[["team","Launch free with the Naano team","A campaign manager turns your selection into a ready-to-launch campaign."],["ai","Create with AI","AI asks the right questions and prepares a fully editable brief."],["link","Start from your link","Paste a campaign you already ran. Naano reuses the brief."]].map(x=>(
          <button key={x[0]} onClick={()=>setMethod(x[0] as "ai"|"team"|"link")} className="card p-6 text-left hover:border-black"><h3 className="text-lg font-semibold">{x[1]}</h3><p className="mt-3 text-sm leading-6 text-[#666]">{x[2]}</p></button>
        ))}
      </div>}
      {method==="ai" && <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card p-7"><div className="grid gap-5"><label className="text-sm font-medium">Product<input className="field mt-2" value={product} onChange={e=>setProduct(e.target.value)}/></label><label className="text-sm font-medium">Ideal customer profile<textarea className="field mt-2 min-h-24" defaultValue="Revenue leaders at 50–500 person B2B SaaS companies"/></label><label className="text-sm font-medium">Offer<textarea className="field mt-2 min-h-20" defaultValue="14-day free trial and a personalized revenue workflow audit"/></label><label className="text-sm font-medium">CTA URL<input className="field mt-2" defaultValue="https://acme.com/signals"/></label></div><button type="button" onClick={generate} className="btn-black mt-6 !rounded-xl">{loading?"✦ Writing your brief…":"✦ Generate campaign brief"}</button></div>
        <aside className={`card p-6 ${generated?"border-[#315cff]":""}`}><p className="eyebrow">AI draft</p>{generated?<><h3 className="mt-4 font-semibold">Campaign objective</h3><p className="mt-2 text-sm leading-6 text-[#666]">Position Acme Signals as the fastest way for modern revenue teams to uncover high-intent buying signals and build pipeline.</p><h3 className="mt-6 font-semibold">Creator guidelines</h3><ul className="mt-2 grid gap-2 text-sm leading-5 text-[#666]"><li>• Open with a real workflow pain</li><li>• Share one actionable insight</li><li>• Explain the 14-day trial clearly</li><li>• Keep the tone personal and practical</li></ul><button onClick={save} className="btn-black mt-7 w-full !rounded-xl">Save & find creators →</button></>:<div className="mt-16 text-center text-sm text-[#999]"><span className="text-3xl">✦</span><p className="mt-3">Your objectives and creator guidelines will appear here.</p></div>}</aside>
      </div>}
      {method==="team" && <div className="card mt-8 p-8"><h3 className="text-2xl font-semibold">Onboarding with Alexis</h3><p className="mt-3 max-w-xl leading-7 text-[#666]">We shape your campaign together. You leave with a shortlist, a brief and a launch date.</p><button onClick={save} className="btn-blue mt-6">Book a free call →</button></div>}
      {method==="link" && <div className="card mt-8 p-8"><h3 className="text-2xl font-semibold">Your brief, your campaign</h3><p className="mt-3 text-[#666]">Paste a Notion or Google Docs link. We build the campaign around it.</p><input className="field mt-6" placeholder="https://notion.so/your-brief"/><button onClick={save} className="btn-black mt-4">Import brief →</button></div>}
    </div>
  </Shell>
}

function CampaignList(){
  const [rows,setRows]=useState(seedCampaigns.map(c=>({...c,userId:"u_hashim",method:"ai",brief:"",createdAt:""})));
  useEffect(()=>{fetch("/api/save").then(r=>r.json()).then(d=>{if(d.campaigns?.length) setRows(d.campaigns)}).catch(()=>{})},[]);
  return <Shell title="Campaigns" action={<Link className="btn-blue text-sm" href="/app/campaigns/new">+ New campaign</Link>}>
    <div className="page"><div className="grid gap-4">{rows.map(c=><Link href={`/app/campaigns/${c.id}`} className="card grid items-center gap-5 p-6 hover:border-[#bbb] md:grid-cols-[1.4fr_.7fr_.6fr_.6fr_30px]" key={c.id}><div><span className="status">{c.status}</span><h3 className="mt-3 text-lg font-semibold">{c.name}</h3><p className="mt-1 text-sm text-[#777]">{c.product}</p></div><div><p className="text-xs text-[#888]">CREATORS</p><b className="mt-1 block">{c.creators}</b></div><div><p className="text-xs text-[#888]">BUDGET</p><b className="mt-1 block">€{c.budget}</b></div><div><p className="text-xs text-[#888]">PROGRESS</p><div className="mt-2 h-1.5 rounded bg-[#eee]"><div className="h-full rounded bg-[#315cff]" style={{width:`${c.progress}%`}}/></div></div><span>→</span></Link>)}</div></div>
  </Shell>
}

function CampaignDetail({id}:{id:string}){
  const [c,setC]=useState(seedCampaigns.find(x=>x.id===id)||{id,name:"Campaign",product:"New",creators:0,status:"Draft",budget:0,progress:8});
  useEffect(()=>{fetch("/api/save").then(r=>r.json()).then(d=>{const found=d.campaigns?.find((x:{id:string})=>x.id===id); if(found) setC(found)}).catch(()=>{})},[id]);
  const statuses=["Invited","Draft ready","Scheduled","Live","Paid"];
  return <Shell title={c.name}>
    <div className="page">
      <div className="card p-7"><div className="flex flex-wrap items-center justify-between gap-4"><div><span className="status">{c.status}</span><h2 className="mt-3 text-2xl font-semibold">{c.product}</h2></div><button className="btn-white">Campaign brief ↗</button></div><div className="mt-8 grid grid-cols-5 gap-2">{statuses.map((s,i)=><div key={s}><div className={`h-2 rounded-full ${i<3?"bg-[#315cff]":"bg-[#eee]"}`}/><p className="mt-2 text-xs text-[#777]">{s}</p></div>)}</div></div>
      <div className="card mt-5 overflow-hidden"><table className="table"><thead><tr><th>Creator</th><th>Status</th><th>Deliverable</th><th>Date</th><th>Fee</th></tr></thead><tbody>{creators.slice(0,c.creators).map((x,i)=><tr key={x.id}><td><div className="flex items-center gap-3"><img className="h-9 w-9 rounded-full bg-[#eee]" src={avatar(x.name)} alt=""/><b>{x.name}</b></div></td><td><span className="status">{statuses[Math.min(i+1,4)]}</span></td><td>LinkedIn post</td><td>{i<3?"Sep "+(16+i*2):"TBD"}</td><td>€{x.price}</td></tr>)}</tbody></table></div>
    </div>
  </Shell>
}

function Collaborations(){
  const [rows,setRows]=useState<{id:string;creatorId:string;campaignId:string;status:string;fee:number}[]>([]);
  useEffect(()=>{fetch("/api/save").then(r=>r.json()).then(d=>{if(d.bookings?.length) setRows(d.bookings)}).catch(()=>{})},[]);
  const campaignName=(id:string)=>seedCampaigns.find(c=>c.id===id)?.name||id;
  const creatorName=(id:string)=>creators.find(c=>c.id===id)?.name||id;
  const shown=rows.length?rows:creators.slice(0,6).map((c,i)=>({id:c.id,creatorId:c.id,campaignId:seedCampaigns[i%3].id,status:["Draft ready","Live","Invited","Scheduled","Paid","Invited"][i],fee:c.price}));
  return <Shell title="Collaborations">
    <div className="page">
      <div className="card overflow-hidden"><table className="table"><thead><tr><th>Creator</th><th>Campaign</th><th>Status</th><th>Deliverable</th><th>Fee</th></tr></thead>
      <tbody>
        {shown.map((row)=><tr key={row.id}><td><b>{creatorName(row.creatorId)}</b></td><td>{campaignName(row.campaignId)}</td><td><span className="status">{row.status}</span></td><td>LinkedIn post</td><td>€{row.fee}</td></tr>)}
      </tbody></table></div>
    </div>
  </Shell>
}

function Tracking(){
  return <Shell title="Results">
    <div className="page">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Impressions","138.1k","+22%"],["Clicks","5,132","+31%"],["Leads","231","+18%"],["Attributed pipeline","€106.7k","+42%"]].map(x=><div className="card metric" key={x[0]}><p className="text-sm text-[#777]">{x[0]}</p><div className="mt-3 flex items-end justify-between"><b className="text-3xl tracking-tight">{x[1]}</b><span className="text-xs font-semibold text-[#1c9a58]">{x[2]}</span></div></div>)}</div>
      <div className="card mt-5 p-6"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Performance over time</h3><p className="mt-1 text-xs text-[#888]">Last 30 days</p></div><select className="field !w-auto"><option>All campaigns</option></select></div><div className="mt-8 flex h-52 items-end gap-2">{[28,34,30,48,42,51,62,55,71,66,78,87,82,94,90,100].map((n,i)=><div className="flex-1 rounded-t bg-[#315cff]" style={{height:`${n}%`,opacity:.25+i/22}} key={i}/>)}</div></div>
      <div className="card mt-5 overflow-x-auto"><table className="table"><thead><tr><th>Creator</th><th>Campaign</th><th>Status</th><th>Impressions</th><th>Clicks</th><th>Leads</th><th>Pipeline</th></tr></thead><tbody>{trackingRows.map(r=><tr key={r.creator}><td><b>{r.creator}</b></td><td>{r.campaign}</td><td><span className="status">{r.status}</span></td><td>{r.impressions}</td><td>{r.clicks.toLocaleString()}</td><td>{r.leads}</td><td><b>{r.pipeline}</b></td></tr>)}</tbody></table></div>
    </div>
  </Shell>
}

function Messages(){
  return <Shell title="Messages">
    <div className="page max-w-[820px] grid gap-4">
      {[["Thomas Higadère","Draft is ready for Q4 Revenue Playbook. Can you review the hook?"],["Robin Tempe","Need one more example for the RevOps angle."],["Naano team","Want a strategist on the Spring launch? 15 min, free."]].map(x=>(
        <div className="card p-6" key={x[0]}><b>{x[0]}</b><p className="mt-2 text-sm leading-6 text-[#666]">{x[1]}</p><button className="btn-white mt-4 text-sm">Reply</button></div>
      ))}
    </div>
  </Shell>
}

function Billing(){
  const {account,refresh}=useAccount();
  const [amount,setAmount]=useState("500");
  const [busy,setBusy]=useState(false);
  const wallet=account?.wallet??2480;
  return <Shell title="Billing">
    <div className="page max-w-[720px]">
      <div className="card p-8">
        <p className="eyebrow">Wallet</p>
        <p className="mt-3 text-5xl font-semibold tracking-tight">€{wallet.toLocaleString()}</p>
        <p className="mt-3 text-sm text-[#777]">Saved in /data/db.json. One-time deposit, used across campaigns.</p>
        <label className="mt-8 block text-sm font-medium">Add budget (€)<input className="field mt-2" value={amount} onChange={e=>setAmount(e.target.value)}/></label>
        <button disabled={busy} onClick={async()=>{setBusy(true); try{await api("/api/save",{kind:"wallet",amount:Number(amount)}); await refresh();} finally{setBusy(false)}}} className="btn-blue mt-5">{busy?"Saving…":`Add €${amount} →`}</button>
      </div>
      <div className="card mt-5 p-8">
        <h3 className="font-semibold">Plan</h3>
        <p className="mt-2 text-sm text-[#666]">Self-Serve · €0 / month. Switch to Managed (€700/mo) if you want Naano to run sourcing and reporting.</p>
        <Link href="/pricing" className="btn-white mt-5 inline-flex">See pricing</Link>
      </div>
    </div>
  </Shell>
}

export default function AppRouter(){
  const path=usePathname(); const p=path.split("/").filter(Boolean);
  if(path==="/app") return <Overview/>;
  if(path==="/app/creators") return <Discover/>;
  if(path==="/app/campaigns/new") return <NewCampaign/>;
  if(path==="/app/campaigns") return <CampaignList/>;
  if(path==="/app/collaborations") return <Collaborations/>;
  if(path==="/app/tracking") return <Tracking/>;
  if(path==="/app/messages") return <Messages/>;
  if(path==="/app/billing") return <Billing/>;
  if(p[1]==="creators"&&p[2]) return <Profile id={p[2]}/>;
  if(p[1]==="campaigns"&&p[2]) return <CampaignDetail id={p[2]}/>;
  return <Overview/>;
}
