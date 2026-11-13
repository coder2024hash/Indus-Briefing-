import { getStore } from "@netlify/blobs";
import { notify, esc } from "../lib/notify.mjs";
const json = (b, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let body;
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }
  if (body.website) return json({ ok: true }); // honeypot
  const email = String(body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254)
    return json({ error: "Enter a valid email address." }, 400);
  const store = getStore("subscribers");
  if (await store.get(email)) return json({ ok: true, message: "You're already subscribed." });
  await store.setJSON(email, { email, at: new Date().toISOString() });
  await notify("New subscriber", `<p>${esc(email)} subscribed to Indus Briefing updates.</p>`);
  return json({ ok: true, message: "Subscribed. We'll email you when new research is published." });
};
export const config = { path: "/api/subscribe" };
