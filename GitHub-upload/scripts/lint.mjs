import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import MarkdownIt from "markdown-it";
const md = new MarkdownIt();
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    const file = path.posix.join(dir,entry.name);
    if (entry.isDirectory()) walk(file);
    if (entry.isFile() && file.endsWith(".md")) files.push(file);
  }
}
for (const folder of ["raw","wiki","reports"]) if (fs.existsSync(folder)) walk(folder);
files.push("AGENTS.md");
const generated = new Set(["slides/blue-dot.html","reports/drafts/round-1.html","reports/workflow.html","index.html"]);
const hrefs = file => md.parse(fs.readFileSync(file,"utf8"),{})
  .flatMap(token => token.children ?? []).filter(t=>t.type==="link_open").map(t=>t.attrGet("href"));
const problems = [];
let links = 0;
for (const file of files)
  for (const href of hrefs(file)) {
    if (/^[a-z][a-z\d+.-]*:|^#|^\/\//i.test(href)) continue;
    links++;
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(file),decodeURI(href.split("#")[0])));
    if (!fs.existsSync(target) && !generated.has(target)) problems.push(file+" → "+href);
  }
const ids = fs.readdirSync("raw").filter(file=>/^GNSS-\d+\.md$/.test(file));
const indexLinks = hrefs("wiki/index.md");
for (const id of ids) {
  const source = "wiki/sources/"+id;
  if (!fs.existsSync(source)) { problems.push("Missing summary: "+source); continue; }
  if (!indexLinks.includes("sources/"+id)) problems.push("Unindexed: "+source);
  for (const href of hrefs(source).filter(value=>value.startsWith("../topics/"))) {
    const topic = path.posix.normalize(path.posix.join("wiki/sources", href));
    if (!hrefs(topic).includes("../sources/"+id)) problems.push("Missing back citation: "+topic+" → "+id);
  }
}
const values = {pa: 20_000_000+60-20, pb: 20_000_004+63-20};
assert.equal(values.pb-values.pa, 4+3);
if (problems.length) throw new Error(problems.join("\n"));
console.log(`Wiki lint: ${files.length} Markdown files, ${links} local links, ${ids.length} course source IDs and 1 arithmetic example passed.`);
