import { createHash } from "node:crypto";

export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "no-store, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
};

async function readReleaseFile(url: URL) {
  const response = await fetch(url, {
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok || !response.body) throw new Error("Release unavailable");
  const chunks: Uint8Array[] = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > 1024 * 1024) throw new Error("Release metadata too large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function releaseUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("Invalid release location");
  }
  return url;
}

export async function GET() {
  try {
    const location = process.env.DESKTOP_RELEASE_MANIFEST_URL;
    if (!location) throw new Error("Desktop releases are not configured");
    const manifest = JSON.parse((await readReleaseFile(releaseUrl(location))).toString("utf8"));
    const desktop = manifest.desktop;
    if (manifest.format !== 1 || desktop?.kind !== "desktop") throw new Error("Invalid release");
    const metadataUrl = releaseUrl(desktop.url);
    if (!metadataUrl.pathname.endsWith("/latest-mac.yml")) throw new Error("Invalid metadata location");
    const bytes = await readReleaseFile(metadataUrl);
    if (bytes.length !== desktop.bytes || createHash("sha256").update(bytes).digest("hex") !== desktop.sha256) {
      throw new Error("Release metadata integrity check failed");
    }
    // electron-builder lists the DMG alongside the ZIP in the promoted metadata.
    const filename = /^\s*- url: ["']?([^\r\n"']+\.dmg)["']?\s*$/m.exec(bytes.toString("utf8"))?.[1];
    if (!filename) throw new Error("No DMG in this release");
    const dmg = new URL(filename, metadataUrl);
    const folder = new URL("./", metadataUrl);
    if (dmg.origin !== folder.origin || !dmg.pathname.startsWith(folder.pathname)
      || dmg.username || dmg.password || dmg.search || dmg.hash) {
      throw new Error("DMG is outside the published release");
    }
    return new Response(null, { status: 307, headers: { ...headers, Location: dmg.href } });
  } catch {
    return new Response("The download is temporarily unavailable. Please go back and try again shortly.", {
      status: 503,
      headers: { ...headers, "Content-Type": "text/plain; charset=utf-8", "Retry-After": "60" },
    });
  }
}
