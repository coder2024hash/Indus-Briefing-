import { getStore } from "@netlify/blobs";

export default async (req) => {
  const token = Netlify.env.get("ADMIN_TOKEN");
  const auth = req.headers.get("authorization") || "";
  if (!token || auth !== `Bearer ${token}`) return new Response("Unauthorized", { status: 401 });
  const kind = new URL(req.url).searchParams.get("type") === "messages" ? "messages" : "subscribers";
  const store = getStore(kind);
  const { blobs } = await store.list();
  const rows = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
  return new Response(JSON.stringify(rows, null, 2), { headers: { "Content-Type": "application/json" } });
};
export const config = { path: "/api/admin/export" };
