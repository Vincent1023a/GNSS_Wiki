import fs from "node:fs";
import path from "node:path";
import { markdown as md } from "./markdown.mjs";
import { shell, map } from "./layout.mjs";
import { renderDeck } from "./render-deck.mjs";
import { verifyReviewedContent } from "./review.mjs";

const outgoing = md.renderer.rules.link_open ??
  ((tokens,index,opts,env,self) => self.renderToken(tokens,index,opts));
md.renderer.rules.link_open = (tokens,index,opts,env,self) => {
  const href = tokens[index].attrGet("href");
  if (href && !/^[a-z][a-z\d+.-]*:|^\/\//i.test(href)) {
    tokens[index].attrSet("href", href.replace(/\.md(?=#|\?|$)/i,".html"));
  }
  return outgoing(tokens,index,opts,env,self);
};
const read = file => fs.readFileSync(file,"utf8");
const write = (file,data) => {
  const target = path.join("dist",file);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,data);
};
const repositoryOnly = [
  "wiki/log.html",
  "reports/run.html",
  "reports/round-1.html",
  "reports/round-1-query.html",
  "reports/drafts/round-1.html",
  "reports/submission.html"
];
function convertTree(folder) {
  for (const entry of fs.readdirSync(folder,{withFileTypes:true})) {
    const source = path.posix.join(folder,entry.name);
    if (entry.isDirectory()) convertTree(source);
    if (entry.isFile() && source.endsWith(".md") && !repositoryOnly.includes(source.replace(/\.md$/, ".html"))) {
      convertMarkdown(source);
    }
  }
}
function convertMarkdown(source) {
  const raw = read(source);
  const title = raw.match(/^# (.+)$/m)?.[1] ?? source;
  const prefix = "../".repeat(source.split("/").length-1);
  write(source.replace(/\.md$/,".html"), shell(title,prefix,`<main class="shell document">${md.render(raw)}</main>`));
}
const mode = process.argv[2];
if (mode === "--draft") {
  const data = JSON.parse(read("course/round-1-deck.json"));
  const target = "course/round-1.html";
  fs.writeFileSync(target,renderDeck(data,"../../",true),{flag:"wx"});
  console.log("Preserved first-run HTML: " + target);
  process.exit(0);
}
verifyReviewedContent();
for (const file of repositoryOnly) fs.rmSync(path.join("dist",file),{force:true});
for (const folder of ["raw","wiki"]) convertTree(folder);
convertMarkdown("reports/claims.md");
convertMarkdown("AGENTS.md");
write("raw/IS-GPS-200N.pdf",fs.readFileSync("raw/IS-GPS-200N.pdf"));
fs.cpSync("site/assets","dist/assets",{recursive:true});
write("assets/katex.min.css",read("node_modules/katex/dist/katex.min.css"));
fs.cpSync("node_modules/katex/dist/fonts","dist/assets/fonts",{recursive:true});
write("assets/katex-license.txt",read("node_modules/katex/LICENSE"));
write(".nojekyll","");
write("slides/blue-dot.html",renderDeck(JSON.parse(read("course/deck.json")),"../"));
write("reports/workflow.html",shell("兩輪工作流程圖","../",read("site/workflow.html")));
write("slides/gnss-rtk-ppk.html",read("slides/gnss-rtk-ppk.html").replace(/(\.\.\/wiki\/[\w/.-]+)\.md/g,"$1.html"));
write("index.html",shell("GNSS 衛星定位原理","",`<main class="shell"><div class="hero"><div><h1>手機收到衛星訊號後，怎麼變成地圖上的藍點？</h1><p>以 GPS 為例，從衛星傳來的導航電文與測距碼，一路追到手機地圖上的位置估計。</p><a class="cta" href="slides/blue-dot.html">開始 9 頁教學</a></div>${map("","intro")}</div>
<div class="route-list"><div><a href="wiki/index.html">GNSS Wiki</a><p>概念、原文與延伸閱讀。</p></div><div><a href="reports/workflow.html">Loop／graph 流程圖</a><p>查看兩輪工作流程和檢查失敗後的回退路徑。</p></div><div><a href="reports/claims.html">投影片與來源對照</a><p>追查每頁主張、Wiki 概念及原文段落。</p></div><div><a href="AGENTS.html">Wiki 維護規則</a><p>資料納入、查詢、檢查與生成規則。</p></div></div></main>`));
console.log("Site built in dist");
