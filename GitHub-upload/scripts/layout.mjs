export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

export function shell(title, prefix, main) {
  const mathStyles = main.includes('class="katex') ? `<link rel="stylesheet" href="${prefix}assets/katex.min.css">` : "";
  return `<!doctype html>
<html lang="zh-Hant">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title>${mathStyles}<link rel="stylesheet" href="${prefix}assets/course.css"></head>
<body><header class="sitebar"><div class="shell"><a class="brand" href="${prefix}index.html">GNSS 衛星定位原理</a><nav aria-label="網站導覽"><a href="${prefix}slides/blue-dot.html">教學簡報</a><a href="${prefix}wiki/index.html">Wiki</a><a href="${prefix}reports/workflow.html">流程圖</a></nav></div></header>
${main}
</body></html>
`;
}

export function map(prefix, mode) {
  const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="#327ce52a"/><circle cx="${x}" cy="${y}" r="8.5" fill="#125dcb" stroke="#fff" stroke-width="3"/>`;
  const normal = dot(350, 118);
  const direct = `<path d="M314 32L350 118" stroke="#225ea0" stroke-width="4"/>
<text x="327" y="53" class="diagram-label">直接訊號</text>${normal}`;
  const blocked = `<path d="M180 39L265 101" stroke="#a2400c" stroke-width="4" stroke-dasharray="8 5"/>
<path d="M256 93l18 18m0-18l-18 18" stroke="#a2400c" stroke-width="4"/>
<text x="128" y="37" class="diagram-label">遮蔽</text>${normal}`;
  const reflected = `<defs><marker id="path-end" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M1 1L6 3L1 5" fill="none" stroke="#ba4c15" stroke-width="1.4"/></marker></defs>
<path d="M380 31L424 136L351 118" fill="none" stroke="#bb4b0c" stroke-width="4" marker-end="url(#path-end)"/>
<path d="M350 118L388 149" stroke="#bb4b0c" stroke-width="3" stroke-dasharray="5 4"/>
<circle cx="350" cy="118" r="7" fill="#fff" stroke="#a2400c" stroke-width="3"/>${dot(388,149)}
<g fill="#833008" font-size="16" font-weight="800" font-family="system-ui,sans-serif"><text x="420" y="117">反射</text><text x="401" y="174">偏移示意</text></g>`;
  const coordinate = `<path d="M350 90v56m-28-28h56" stroke="#245a9b" stroke-width="1.4" stroke-dasharray="4 4"/>${normal}<text x="373" y="108" fill="#164b8b" font-size="14" font-weight="800">經緯度定位點</text>`;
  const scenes = {
    direct: [direct, "直接訊號抵達接收機"],
    blocked: [blocked, "建物阻擋直接訊號"],
    reflected: [reflected, "訊號經牆面反射後抵達接收機，藍點位置偏移示意"],
    coordinates: [coordinate, "同一街廓上的經緯度定位點"]
  };
  const [overlay,label] = scenes[mode] ?? [normal,"街廓上的藍色定位點"];
  return `<figure class="map-art"><img src="${prefix}assets/city-map.svg" alt=""><svg viewBox="0 0 560 390" role="img" aria-label="${label}">${overlay}</svg><figcaption>街廓示意圖</figcaption></figure>`;
}
