import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
const ROOT = path.resolve("dist");
const TYPES = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",
  ".js":"text/javascript; charset=utf-8",".svg":"image/svg+xml",".pdf":"application/pdf",".woff2":"font/woff2"};
export function createPreview() {
  return createServer(async (req,res) => {
    try {
      const suffix = decodeURIComponent(new URL(req.url,"http://localhost").pathname)
        .replace(/^\/gnss-course(?=\/|$)/,"").replace(/^\/+/, "");
      const file = path.resolve(ROOT, suffix.endsWith("/") || !suffix ? suffix+"index.html" : suffix);
      if (!file.startsWith(ROOT+path.sep)) throw new Error("Outside output");
      const data = await readFile(file);
      res.writeHead(200,{"Content-Type":TYPES[path.extname(file)] ?? "application/octet-stream"});
      res.end(data);
    } catch {
      res.writeHead(404,{"Content-Type":"text/plain"});
      res.end("Not found");
    }
  });
}
if (process.argv[1] && import.meta.url === (await import("node:url")).pathToFileURL(process.argv[1]).href) {
  createPreview().listen(4173,"127.0.0.1",()=>console.log("http://127.0.0.1:4173/gnss-course/"));
}
