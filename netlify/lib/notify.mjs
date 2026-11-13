const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export { esc };

export async function notify(subject, html) {
  const key = Netlify.env.get("RESEND_API_KEY");
  const to = Netlify.env.get("NOTIFY_EMAIL");
  if (!key || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Indus Briefing <onboarding@resend.dev>", to: [to], subject, html }),
    });
  } catch (e) { console.error("notify failed", e); }
}
