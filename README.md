# naano rebuild

24 hour clone of [naano.com](https://naano.com) for an 8x Software Engineer assignment.

Naano is a B2B LinkedIn creator marketplace. Brands book vetted creators at a fixed price per post, then track clicks, leads and pipeline. Creators set their price and get paid after the post is approved.

I signed up on the live product first (brand account, Hashim Khan), went through register / email code / the brand workspace, then rebuilt the loop here.

## What this includes

Public site
- landing (marketplace pitch, logos, how it works, BlogSEO-style case study, creator and agency sections, FAQ)
- pricing (Self-Serve €0/mo, Managed €700/mo)
- register (role, LinkedIn/Google/email, 6 digit code)
- login

Brand workspace
- overview
- creator search and profiles
- book a creator at a fixed €/post
- new campaign (Naano team, AI brief, or import a link)
- campaigns, collaborations, results, messages, billing/wallet

Creator workspace
- incoming collabs, draft status, payouts, price slider

This is a working demo. Accounts, bookings, campaigns and wallet live in `data/db.json` and are served at `/data/db.json`. On Vercel the same JSON is written through the API. Demo login: `hashim@acme.com` / `demo`. Creator side: `creator@naano.com` / `demo`. Sign up creates a real account and a 6 digit code stored in that file.

## Agent capture

See `CAPTURE-TEST.md`. Logs live in `.agent-logs/` and are meant to be committed.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000
