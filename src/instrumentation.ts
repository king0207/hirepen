/**
 * Runs once on server startup. In environments behind an HTTP/HTTPS proxy
 * (e.g. local dev through Clash/VPN), Node's global `fetch` (undici) does NOT
 * honor system proxy settings, so server-side calls to Supabase fail with
 * ECONNRESET. If a proxy URL is configured, route all Node fetch through it.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const proxyUrl =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy;

  if (!proxyUrl) return;

  try {
    const { setGlobalDispatcher, ProxyAgent } = await import("undici");
    setGlobalDispatcher(new ProxyAgent(proxyUrl));
    console.log(`[proxy] Node fetch routed through ${proxyUrl}`);
  } catch (err) {
    console.error("[proxy] Failed to configure ProxyAgent:", err);
  }
}
