# PowerBlade Lawn Care — website + phone app

One build: works as the website on any browser and installs as an app on Android/iPhone ("Add to Home screen").

- `index.html` — the whole site/app (Home, Services, Free Quote, Contact)
- `manifest.webmanifest`, `sw.js`, `icon-*.png` — make it installable and work offline
- Quote and feedback requests open a pre-filled text/email to (615) 587-2226 / PowerBladeLawncare@gmail.com

Deploy free: Cloudflare Pages connected to this (private) GitHub repo — every push updates the website and installed app together, then point powerbladelawncare.com at it once the owner approves.

## Mr. Ed (owner assistant)
Works right away for: the owner's jobs, payments, leads, crew and equipment; step-by-step help using the app; Middle Tennessee lawn basics; adding clients/leads by voice.
To let him answer any lawn and landscaping question, turn on the private AI connection (Cloudflare Pages → Settings → Variables and secrets):
- `ANTHROPIC_API_KEY` — from console.anthropic.com (pay per question, pennies each)
- `OWNER_CODE` — any secret code; enter the same code in Owner Panel → More → Business & rates → "AI connection code"
`functions/api/ask.js` handles it. Nothing is stored. The customer site has no assistant, so customer data never reaches the public side.
