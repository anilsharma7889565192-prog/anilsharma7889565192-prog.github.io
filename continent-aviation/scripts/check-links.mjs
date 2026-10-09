// Crawls a running server (default http://localhost:3000) and verifies every internal link and #anchor resolves.
const base = process.env.BASE_URL ?? "http://localhost:3000";
const seen = new Map();
const queue = ["/"];
const problems = [];

const pageCache = new Map();
async function get(path) {
  if (pageCache.has(path)) return pageCache.get(path);
  const res = await fetch(base + path, { redirect: "follow" });
  const body = res.headers.get("content-type")?.includes("text/html") ? await res.text() : "";
  const out = { status: res.status, body };
  pageCache.set(path, out);
  return out;
}

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  const { status, body } = await get(path);
  seen.set(path, status);
  if (status !== 200) { problems.push(`${path} -> ${status}`); continue; }
  for (const m of body.matchAll(/href="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    if (/^(mailto:|tel:|https?:)/.test(href)) continue;
    if (href.startsWith("#")) {
      if (!body.includes(`id="${href.slice(1)}"`)) problems.push(`${path}: missing anchor ${href}`);
      continue;
    }
    if (!href.startsWith("/") || href.startsWith("/_next")) continue;
    const [pathname, hash] = href.split("#");
    const clean = pathname.split("?")[0];
    queue.push(clean);
    const target = await get(clean);
    if (target.status !== 200) problems.push(`${path}: ${href} -> ${target.status}`);
    else if (hash && !target.body.includes(`id="${hash}"`)) problems.push(`${path}: ${href} anchor "${hash}" not found`);
  }
}
console.log(`Checked ${seen.size} pages:`, [...seen.keys()].join(" "));
if (problems.length) { console.error("PROBLEMS:\n" + [...new Set(problems)].join("\n")); process.exit(1); }
console.log("All internal links and anchors OK.");
