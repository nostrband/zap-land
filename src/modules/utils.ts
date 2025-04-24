export function now() {
  return Math.floor(Date.now() / 1000);
}

export function normalizeRelay(r: string) {
  try {
    const u = new URL(r);
    if (u.protocol !== "wss:" && u.protocol !== "ws:") return undefined;
    if (u.hostname.endsWith(".onion")) return undefined;
    if (u.hostname === "localhost") return undefined;
    if (u.hostname === "127.0.0.1") return undefined;
    return u.href;
  } catch {}
}
