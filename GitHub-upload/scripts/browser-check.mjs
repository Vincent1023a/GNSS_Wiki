import { once } from "node:events";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { createPreview } from "./serve.mjs";

const folder = fs.mkdtempSync(path.join(os.tmpdir(),"gnss-course-qa-"));
const edge = process.env.GNSS_BROWSER || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const browser = spawn(edge, ["--headless=new","--disable-gpu","--disable-background-networking",
  "--disable-extensions","--no-first-run","--remote-debugging-port=0",
  "--user-data-dir="+path.join(folder,"profile"),"about:blank"],{windowsHide:true});
const server = createPreview().listen(0,"127.0.0.1");
let socket;
const sleep = ms => new Promise(resolve => setTimeout(resolve,ms));

try {
  if (!server.listening) await once(server,"listening");
  const base = "http://127.0.0.1:"+server.address().port+"/gnss-course/";
  const portFile = path.join(folder,"profile","DevToolsActivePort");
  for(let count=0;!fs.existsSync(portFile)&&count<100;count++) await sleep(100);
  const port = fs.readFileSync(portFile,"utf8").split(/\r?\n/)[0];
  const targets = await (await fetch("http://127.0.0.1:"+port+"/json/list")).json();
  socket = new WebSocket(targets.find(target=>target.type==="page").webSocketDebuggerUrl);
  await once(socket,"open");
  const pending = new Map(), issues = [], httpIssues = [];
  let serial = 0;
  socket.onmessage = ({data}) => {
    const msg = JSON.parse(data);
    if(msg.method==="Runtime.exceptionThrown") issues.push(msg.params.exceptionDetails.text);
    if(msg.method==="Network.responseReceived" && msg.params.response.status>=400 &&
        msg.params.response.url.startsWith(base)) httpIssues.push(msg.params.response.url);
    const entry = pending.get(msg.id);
    if (!entry) return;
    pending.delete(msg.id);
    if (msg.error) entry.reject(msg.error); else entry.resolve(msg.result);
  };
  const cdp = (method,params={})=>new Promise((resolve,reject)=>{
    pending.set(++serial,{resolve,reject});
    socket.send(JSON.stringify({id:serial,method,params}));
  });
  const run = async expression => {
    const result = await cdp("Runtime.evaluate",{expression,returnByValue:true});
    if(result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? expression);
    return result.result.value;
  };
  const until = async expression => {
    for(let count=0;count<100;count++){if(await run(expression)) return;await sleep(40);}
    throw new Error("Timed out: "+expression);
  };
  const navigate = async route=>{
    await cdp("Page.navigate",{url:base+route});
    await until("location.href === "+JSON.stringify(base+route)+" && document.readyState === 'complete'");
  };
  const viewport = (width,height,mobile=false)=>cdp("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile});
  const screenshot = async name=>{
    const {data}=await cdp("Page.captureScreenshot",{format:"png"});
    fs.writeFileSync(path.join(folder,name+".png"),Buffer.from(data,"base64"));
  };
  const toSlide = async index=>{
    await run("location.hash = '#page-"+index+"'");
    await until("document.querySelector('#page-"+index+"') && !document.querySelector('#page-"+index+"').hidden");
  };
  const chooseDiagram = async (id,index) => {
    await run("document.querySelector('#"+id+" [data-diagram-choice=\""+index+"\"]').click()");
    const states = await run("[...document.querySelectorAll('#"+id+" [data-diagram-view]:not([hidden])')].map(view=>Number(view.dataset.diagramView))");
    assert.deepEqual(states,[index],id);
    assert.equal(await run("document.querySelector('#"+id+" [data-diagram-choice=\""+index+"\"]').getAttribute('aria-pressed')"),"true",id);
    return "document.querySelector('#"+id+" [data-diagram-view]:not([hidden])')";
  };

  await cdp("Page.enable");
  await cdp("Runtime.enable");
  await cdp("Network.enable");
  await viewport(1440,900);
  await navigate("index.html");
  const homeLinks = await run("[...document.querySelectorAll('main a')].map(a=>a.href)");
  assert.equal(homeLinks.length,5);
  for (const link of homeLinks) assert.equal((await fetch(link)).status,200,link);
  const unpublished = ["wiki/log.html","reports/run.html","reports/round-1.html",
    "reports/round-1-query.html","reports/drafts/round-1.html","reports/submission.html"];
  for (const route of unpublished) assert.equal((await fetch(base+route)).status,404,route);
  assert.equal(fs.existsSync("reports/submission.md"),false);
  await screenshot("home");
  await run("document.querySelector('main .cta').click()");
  await until("document.documentElement.classList.contains('enhanced')");
  assert.equal(await run("document.querySelectorAll('.deck-page').length"),9);
  assert.equal(await run("document.querySelector('#previous').disabled"),true);
  await run("document.querySelector('#next').click()");
  await until("location.hash === '#page-2' && !document.querySelector('#page-2').hidden");
  await cdp("Input.dispatchKeyEvent",{type:"keyDown",key:"ArrowLeft",code:"ArrowLeft",windowsVirtualKeyCode:37});
  await until("location.hash === '#page-1' && !document.querySelector('#page-1').hidden");
  await cdp("Input.dispatchKeyEvent",{type:"keyDown",key:"ArrowRight",code:"ArrowRight",windowsVirtualKeyCode:39});
  await until("location.hash === '#page-2' && !document.querySelector('#page-2').hidden");
  await toSlide(1);
  for(let index=0;index<4;index++){
    await run("document.querySelector('[data-flow=\""+index+"\"]').click()");
    const panel = await run("[...document.querySelectorAll('[data-flow-detail]:not([hidden])')].map(x=>x.textContent)");
    assert.equal(panel.length,1);
    assert.match(panel[0],/輸入.*\n?\s*.*產出/s);
    assert.equal(await run("document.querySelector('[data-flow=\""+index+"\"]').getAttribute('aria-pressed')"),"true");
  }
  await toSlide(3);
  const upperWaveforms = new Set(), lowerWaveforms = new Set();
  for(let step=0;step<3;step++){
    const active = await chooseDiagram("code-alignment",step);
    upperWaveforms.add(await run(active+".querySelector('path[stroke=\"#155ac3\"][stroke-width=\"3.8\"]').getAttribute('d')"));
    lowerWaveforms.add(await run(active+".querySelector('path[stroke=\"#ae490d\"][stroke-width=\"3.8\"]').getAttribute('d')"));
  }
  assert.equal(upperWaveforms.size,1);
  assert.equal(lowerWaveforms.size,3);
  await toSlide(4);
  assert(await run("document.querySelector('#page-4 .katex math') !== null"));
  const before = await run("[...document.querySelectorAll('[data-radius]')].map(c=>+c.getAttribute('r'))");
  const centers = await run("[...document.querySelectorAll('[data-radius]')].map(c=>[c.getAttribute('cx'),c.getAttribute('cy')])");
  await run("document.querySelector('#clock-toggle').click()");
  assert(await run("!document.querySelector('#clock-biased').hidden && !!document.querySelector('#clock-biased .katex math')"));
  const after = await run("[...document.querySelectorAll('[data-radius]')].map(c=>+c.getAttribute('r'))");
  const deltas = after.map((value,index)=>+(value-before[index]).toFixed(2));
  assert.deepEqual(deltas,[21.6,21.6,21.6]);
  assert.deepEqual(await run("[...document.querySelectorAll('[data-radius]')].map(c=>[c.getAttribute('cx'),c.getAttribute('cy')])"),centers);
  const clipped = await run("[...document.querySelectorAll('[data-radius]')].map(c=>{const r=+c.getAttribute('r');const x=+c.getAttribute('cx');const y=+c.getAttribute('cy');const v=c.ownerSVGElement.viewBox.baseVal;return x-r<v.x || x+r>v.x+v.width || y-r<v.y || y+r>v.y+v.height})");
  await sleep(210);
  await screenshot("clock-on");
  await run("document.querySelector('#clock-toggle').click()");
  assert(await run("!document.querySelector('#clock-zero').hidden && document.querySelector('#clock-biased').hidden"));
  assert.deepEqual(await run("[...document.querySelectorAll('[data-radius]')].map(c=>+c.getAttribute('r'))"),before);
  assert.deepEqual(clipped,[false,false,false],"All shifted range circles must fit in the SVG viewBox");
  await toSlide(5);
  for(let step=0;step<3;step++){
    const active = await chooseDiagram("satellite-count",step);
    assert.equal(await run(active+".querySelectorAll('[data-observation=available]').length"),step+3);
  }
  await toSlide(6);
  for(let step=0;step<3;step++){
    const active = await chooseDiagram("coordinate-views",step);
    assert.equal(await run("!!"+active+".querySelector('.map-art')"),step===2);
  }
  await toSlide(7);
  for(let step=0;step<3;step++){
    const active = await chooseDiagram("street-signals",step);
    assert.match(await run(active+".querySelector('svg').getAttribute('aria-label')"),[/直接/,/阻擋/,/反射/][step]);
  }
  for (let i=1;i<=9;i++){
    await toSlide(i);
    assert.equal(await run("document.querySelectorAll('.deck-page:not([hidden])').length"),1);
    assert.equal(await run("document.querySelector('#page-count').textContent"),i+" / 9");
    assert(await run("document.documentElement.scrollWidth <= innerWidth"),"desktop "+i);
    assert.equal(await run("document.querySelectorAll('.deck-page:not([hidden]) .evidence a').length > 0"),true);
    await screenshot("desktop-"+i);
  }
  assert.equal(await run("document.querySelector('#next').disabled"),true);
  assert.equal(await run("[...document.querySelectorAll('.deck-page figure img')].every(x=>x.complete && x.naturalWidth>0)"),true);
  assert.equal(await run("new Set([...document.querySelectorAll('.deck-page figure img')].map(img=>img.src)).size"),1);
  await toSlide(8);
  for(const [index,correct] of [[0,0],[1,1]]){
    const q = "document.querySelectorAll('.quiz')["+index+"]";
    for(let option=0;option<3;option++){
      await run(q+".querySelectorAll('button')["+option+"].click()");
      const feedback = await run(q+".querySelector('.feedback').textContent");
      assert(feedback);
      assert.equal(feedback.startsWith("答對"),option===correct);
    }
  }
  const invalid = "第四顆衛星是用來測高度的。";
  assert.equal(await run("document.body.textContent.includes("+JSON.stringify(invalid)+")"),false);

  await viewport(390,844,true);
  await cdp("Emulation.setTouchEmulationEnabled",{enabled:true,maxTouchPoints:1});
  for(let i=1;i<=9;i++){
    await toSlide(i);
    assert(await run("document.documentElement.scrollWidth <= innerWidth"),"mobile "+i);
    await screenshot("mobile-"+i);
  }
  for (const [page,id] of [[3,"code-alignment"],[5,"satellite-count"],[6,"coordinate-views"],[7,"street-signals"]]){
    await toSlide(page);
    for(let step=0;step<3;step++){
      await chooseDiagram(id,step);
      assert(await run("document.documentElement.scrollWidth <= innerWidth"),id+" "+step);
    }
  }
  await toSlide(1);
  await cdp("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:305,y:144}]});
  await cdp("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:203,y:144}]});
  await cdp("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
  await until("location.hash === '#page-2' && !document.querySelector('#page-2').hidden");
  await cdp("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:92,y:144}]});
  await cdp("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:215,y:144}]});
  await cdp("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
  await until("location.hash === '#page-1' && !document.querySelector('#page-1').hidden");

  await toSlide(2);
  await run("document.querySelector('#page-2 .evidence a').click()");
  await until("location.pathname.endsWith('/wiki/topics/navigation-message.html') && document.readyState==='complete'");
  await run("[...document.querySelectorAll('main a')].find(a=>a.textContent==='GNSS-13').click()");
  await until("location.pathname.endsWith('/wiki/sources/GNSS-13.html') && document.readyState==='complete'");
  const original = await run("[...document.querySelectorAll('main a')].find(a=>a.textContent==='開啟原文').href");
  assert.equal(original,"https://archive.gps.gov/technical/icwg/IS-GPS-200N.pdf#page=125");
  await run("[...document.querySelectorAll('main a')].find(a=>a.textContent==='來源記錄').click()");
  await until("location.pathname.endsWith('/raw/GNSS-13.html') && document.readyState==='complete'");
  const preserved = await run("document.querySelector('main a[href$=\".pdf\"]').href");
  assert.equal((await fetch(preserved)).headers.get("content-type"),"application/pdf");
  await navigate("reports/claims.html");
  assert.equal(await run("document.querySelectorAll('tbody tr').length"),15);
  await run("document.querySelector('tbody a').click()");
  await until("location.pathname.endsWith('/slides/blue-dot.html') && location.hash === '#page-1'");
  for(const route of ["index.html","wiki/index.html","reports/workflow.html","reports/claims.html","wiki/topics/between-receiver.html"]){
    await navigate(route);
    assert(await run("document.documentElement.scrollWidth <= innerWidth"),"mobile "+route);
  }
  assert.equal(await run("document.querySelectorAll('.katex-display math').length"),2);
  assert.equal(await run("document.querySelectorAll('.katex-error').length"),0);
  assert(await run("document.querySelector('.katex-display annotation').textContent.includes('P_A')"));
  await cdp("Runtime.evaluate",{expression:"document.fonts.ready",awaitPromise:true});
  assert(await run("[...document.fonts].some(font => font.family.startsWith('KaTeX') && font.status === 'loaded')"));
  await screenshot("mobile-single-difference");

  const files = fs.readdirSync("dist",{recursive:true}).filter(file=>file.endsWith(".html"));
  const localChecks = new Set();
  for(const file of files){
    const current = new URL(file.replaceAll("\\","/"),base);
    for(const [,raw] of fs.readFileSync(path.join("dist",file),"utf8").matchAll(/(?:href|src)="([^"]+)"/g)){
      const url = new URL(raw.replaceAll("&amp;","&"),current);
      if(url.protocol===current.protocol && url.origin===current.origin){
        assert(url.href.startsWith(base),url.href+" escaped project prefix");
        localChecks.add(url.href);
      }
    }
  }
  const cached = new Map();
  for(const href of localChecks){
    const url = new URL(href);
    const fragment = decodeURIComponent(url.hash.slice(1));
    url.hash = "";
    if(!cached.has(url.href)){
      const response = await fetch(url);
      assert.equal(response.status,200,url.href);
      cached.set(url.href, response.headers.get("content-type")?.startsWith("text/html")
        ? await response.text() : null);
    }
    const html = cached.get(url.href);
    if(fragment && html) assert(html.includes('id="'+fragment+'"'),href);
  }
  assert.deepEqual(issues,[]);
  assert.deepEqual(httpIssues,[]);
  const fileHome = pathToFileURL(path.resolve("dist/index.html")).href;
  await cdp("Page.navigate",{url:fileHome});
  await until("location.href === " + JSON.stringify(fileHome) + " && document.readyState === 'complete'");
  await run("document.querySelector('main .cta').click()");
  await until("location.protocol==='file:' && location.pathname.endsWith('/slides/blue-dot.html') && document.documentElement.classList.contains('enhanced')");
  await run("document.querySelector('#next').click()");
  await until("location.hash === '#page-2' && !document.querySelector('#page-2').hidden");
  console.log(JSON.stringify({time:new Date().toISOString(),pages:9,
    cases:["desktop 1440×900","mobile 390×844","buttons","left/right keyboard","both swipe directions",
      "four flow steps","clock on/off","two quizzes, correct and incorrect","site home/deck/Wiki/reports",
      "slide → concept → summary → raw catalog → preserved original","file URL home and slide navigation",
      "local TeX fonts, rendered formulas and six unpublished routes","all 12 states of four new diagrams"],
    localLinks:localChecks.size, radiusChanges:deltas, publicSourceHref:original, screenshots:folder},null,2));
} finally {
  socket?.close();
  browser.kill();
  server.close();
}
