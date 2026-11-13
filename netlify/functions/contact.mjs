import { getStore } from "@netlify/blobs";
import { notify, esc } from "../lib/notify.mjs";
const json = (b, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let b;
  try { b = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }
  if (b.website) return json({ ok: true });
  const name = String(b.name || "").trim().slice(0, 120);
  const email = String(b.email || "").trim().slice(0, 254);
  const topic = String(b.topic || "General").slice(0, 40);
  const message = String(b.message || "").trim().slice(0, 4000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || message.length < 10)
    return json({ error: "Add your name, a valid email and a message of at least 10 characters." }, 400);
  const id = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  await getStore("messages").setJSON(id, { id, name, email, topic, message, at: new Date().toISOString() });
  await notify(`New message: ${topic}`, `<p><b>${esc(name)}</b> (${esc(email)})</p><p>${esc(message).replace(/\n/g, "<br>")}</p>`);
  return json({ ok: true, message: "Message sent. We reply within two working days." });
};
export const config = { path: "/api/contact" };
