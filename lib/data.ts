export type Creator = {
  id: string; name: string; title: string; followers: number; vertical: string;
  fit: number; price: number; location: string; about: string; audience: string;
};

export const creators: Creator[] = [
  { id:"thomas-higadere", name:"Thomas Higadère", title:"B2B sales systems & outbound", followers:42000, vertical:"sales", fit:96, price:320, location:"Paris, France", about:"I share practical playbooks for modern sales teams, from prospecting to repeatable revenue.", audience:"Sales leaders, founders and account executives at B2B SaaS companies." },
  { id:"robin-tempe", name:"Robin Tempe", title:"RevOps builder & GTM operator", followers:28700, vertical:"RevOps", fit:94, price:280, location:"Lyon, France", about:"Weekly systems and field notes for revenue teams that want to scale without chaos.", audience:"RevOps leaders, CROs and B2B operators across Europe." },
  { id:"eric-djavid", name:"Eric Djavid", title:"Growth for dev-first products", followers:19600, vertical:"devtools", fit:92, price:240, location:"Berlin, Germany", about:"I unpack developer-led growth and the stories behind category-defining software companies.", audience:"Technical founders, developers and product leaders." },
  { id:"marina-panova", name:"Marina Panova", title:"Product marketing strategist", followers:51300, vertical:"marketing-ops", fit:91, price:420, location:"London, UK", about:"Sharp product positioning, launch strategy and customer research for B2B marketers.", audience:"CMOs, product marketers and SaaS founders." },
  { id:"leo-bernard", name:"Léo Bernard", title:"The modern SDR playbook", followers:15800, vertical:"sales", fit:89, price:180, location:"Bordeaux, France", about:"Tactical advice that helps SDR teams book more qualified meetings.", audience:"SDRs, sales managers and early-stage founders." },
  { id:"sarah-chen", name:"Sarah Chen", title:"Building products people love", followers:36400, vertical:"product", fit:88, price:340, location:"Amsterdam, NL", about:"Product discovery, team rituals and honest lessons from the roadmap.", audience:"Product managers, designers and startup leaders." },
  { id:"antoine-girard", name:"Antoine Girard", title:"B2B demand generation", followers:22900, vertical:"marketing-ops", fit:87, price:250, location:"Paris, France", about:"No-fluff demand generation experiments, teardown and campaign lessons.", audience:"Demand gen and growth leaders in B2B software." },
  { id:"maya-patel", name:"Maya Patel", title:"People, culture & future of work", followers:30500, vertical:"HR-tech", fit:85, price:290, location:"Manchester, UK", about:"Better ways to hire, lead and design high-performing distributed teams.", audience:"People leaders, founders and HR technology buyers." },
  { id:"nicolas-rey", name:"Nicolas Rey", title:"Fintech operator notes", followers:14400, vertical:"fintech", fit:84, price:170, location:"Brussels, Belgium", about:"Clear analysis of fintech infrastructure and embedded finance.", audience:"Fintech founders, operators and investors." },
  { id:"elena-rossi", name:"Elena Rossi", title:"AI product & strategy", followers:48700, vertical:"product", fit:82, price:390, location:"Milan, Italy", about:"How AI changes product strategy, workflows and the way software gets built.", audience:"Product leaders, founders and innovation teams." },
  { id:"jonas-klein", name:"Jonas Klein", title:"Open source & developer tools", followers:12600, vertical:"devtools", fit:80, price:150, location:"Munich, Germany", about:"Developer experience, open-source growth and engineering culture.", audience:"Developers, CTOs and DevRel teams." },
  { id:"camille-durand", name:"Camille Durand", title:"Revenue operations in practice", followers:9800, vertical:"RevOps", fit:79, price:120, location:"Nantes, France", about:"Templates and operating cadences for lean GTM teams.", audience:"Revenue operators and startup sales teams." },
  { id:"ines-martin", name:"Inès Martin", title:"Marketing automation decoded", followers:8400, vertical:"marketing-ops", fit:77, price:95, location:"Madrid, Spain", about:"Practical automation recipes and honest martech reviews.", audience:"Marketing ops specialists and growth teams." },
  { id:"adam-walker", name:"Adam Walker", title:"Founding sales stories", followers:6300, vertical:"sales", fit:75, price:60, location:"Dublin, Ireland", about:"Lessons from the messy zero-to-one stage of B2B sales.", audience:"First sales hires and bootstrapped founders." },
  { id:"lina-berg", name:"Lina Berg", title:"Workplace technology", followers:4100, vertical:"HR-tech", fit:72, price:20, location:"Stockholm, Sweden", about:"Research and perspectives on employee experience and workplace software.", audience:"HR leaders and workplace technology teams." }
];

export const campaigns = [
  { id:"q4-revenue", name:"Q4 Revenue Playbook", product:"Acme Revenue OS", creators:4, status:"Live", budget:1280, progress:78 },
  { id:"spring-launch", name:"Spring product launch", product:"Acme Signals", creators:6, status:"In progress", budget:1840, progress:45 },
  { id:"revops-report", name:"State of RevOps 2026", product:"Acme Research", creators:3, status:"Draft", budget:760, progress:18 },
];

export const trackingRows = [
  { creator:"Thomas Higadère", campaign:"Q4 Revenue Playbook", status:"Live", impressions:"48.2k", clicks:1846, leads:86, pipeline:"€42,000" },
  { creator:"Robin Tempe", campaign:"Q4 Revenue Playbook", status:"Live", impressions:"32.8k", clicks:1212, leads:54, pipeline:"€28,500" },
  { creator:"Marina Panova", campaign:"Spring product launch", status:"Live", impressions:"57.1k", clicks:2074, leads:91, pipeline:"€36,200" },
  { creator:"Antoine Girard", campaign:"Spring product launch", status:"Scheduled", impressions:"—", clicks:0, leads:0, pipeline:"—" },
];

export const avatar = (name:string) => `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(name)}&backgroundColor=e8ecff,f2f2f2,ffdfbf`;
