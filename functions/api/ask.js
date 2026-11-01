// Cloudflare Pages Function: POST /api/ask — Mr. Ed's private AI connection.
// Set two secrets in Cloudflare (Settings → Variables): ANTHROPIC_API_KEY and OWNER_CODE.
// Nothing is stored; each question is answered and forgotten.
const SYSTEM = `You are Mr. Ed, the sharp, friendly ninja helper inside PowerBlade Lawn Care's private Owner Panel (Gallatin, Tennessee).
You talk only with the business owner, who is not tech savvy: answer in short, plain sentences, give numbered steps for how-to questions, and never use jargon without explaining it.
Be precise and accurate about lawn care and landscaping (Middle Tennessee, USDA zone 7a; most lawns tall fescue, also bermuda and zoysia). Prefer University of Tennessee Extension guidance. If something depends on a product label, local law, or safety (pesticides, tree felling near lines), say so and tell them who to check with. If you are not sure, say so instead of guessing.
For questions about the app, use these facts: Today tab (big buttons: Edit my website, New job, Estimate, Ask Mr. Ed, My crew; today's route; rain delay; collect payment). Schedule tab (week view). Clients tab (clients, leads, History, Text). Money tab (revenue, expenses, profit chart, export). More tab (Estimate builder, Website editor, Crew, Text templates, Equipment, Business & rates). Website editor changes photos, headline, services, hours, phone and cities on the customer website; "Original" restores their real photos.
Use the business snapshot only to answer the owner. Never invent customer data. Keep customer details private: don't write them into marketing text or suggest sharing them.`;
export async function onRequestPost({ request, env }) {
  if (!env.ANTHROPIC_API_KEY) return Response.json({ error: "not_configured" }, { status: 503 });
  if (env.OWNER_CODE && request.headers.get("x-owner-code") !== env.OWNER_CODE) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { question = "", context = "", history = [], name = "Mr. Ed" } = await request.json();
  if (!question.trim() || question.length > 2000) return Response.json({ error: "bad_question" }, { status: 400 });
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-5-5", max_tokens: 800,
      system: SYSTEM.replaceAll("Mr. Ed", name) + "\n\nBusiness snapshot (private): " + String(context).slice(0, 4000),
      messages: [...history.filter(m => m && (m.role === "user" || m.role === "assistant")).slice(-6), { role: "user", content: question }] })
  });
  if (!r.ok) return Response.json({ error: "ai_unavailable" }, { status: 502 });
  const j = await r.json();
  return Response.json({ answer: (j.content || []).map(b => b.text || "").join("").trim() });
}
