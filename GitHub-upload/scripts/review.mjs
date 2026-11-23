import fs from "node:fs";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
const text = file => fs.readFileSync(file, "utf8");
const hash = value => createHash("sha256").update(value).digest("hex");

function checkSinglePoint(model) {
  assert.equal(model.perMeasurement, "joint-pseudorange",
    "GNSS-04: 每顆衛星提供一筆虛擬距離，沒有個別衛星專解高度。");
  assert.deepEqual(model.estimated, ["X", "Y", "Z", "δtᵣ"]);
  assert.equal(model.geometryRequired, true);
}

function checkNegativeFixture() {
  const fixture = JSON.parse(text("course/test-fourth-satellite.json"));
  assert.equal(fixture.expected, "reject");
  assert.throws(() => checkSinglePoint(fixture.model), /GNSS-04/);
  console.log("Deliberate case rejected by GNSS-04 measurement-role review: " + fixture.statement);
}

export function checkSourceLinks(row) {
  const topic = "wiki/topics/" + row.topic + ".md";
  for (const [id, locator] of row.sources) {
    assert(text(topic).includes("../sources/" + id + ".md"), row.id + " missing " + id + " in concept");
    assert(locator.trim(), row.id + " missing locator");
    assert(fs.existsSync("raw/" + id + ".md"), row.id + " missing raw record");
  }
}

export function verifyReviewedContent() {
  const report = JSON.parse(text("course/review.json"));
  assert(report.rows.every(row => row.verdict === "supported"), "Unsupported teaching claim");
  const deck = text("course/deck.json");
  assert.equal(hash(deck), report.deckSha256, "Deck wording changed after review");
  for (const row of report.rows) checkSourceLinks(row);
  const covered = [...new Set(report.rows.map(row => row.slide))];
  assert.deepEqual(covered,[1,2,3,4,5,6,7,8,9],"Each page needs a reviewed claim or evidence pointer");
  for (const [file, digest] of Object.entries(report.evidenceSha256)) {
    assert.equal(hash(text(file)),digest,"Evidence changed after review: " + file);
  }
  checkSinglePoint(report.singlePointModel);
  checkNegativeFixture();
  console.log(`Preflight: ${report.rows.length} reviewed claims across ${covered.length} pages.`);
}

function recordReviewedContent() {
  const input = JSON.parse(text("course/review-input.json"));
  checkSinglePoint(input.singlePointModel);
  checkNegativeFixture();
  const evidence = new Set();
  for (const row of input.rows) {
    checkSourceLinks(row);
    evidence.add("wiki/topics/" + row.topic + ".md");
    for (const [id] of row.sources) {
      evidence.add("wiki/sources/" + id + ".md");
      evidence.add("raw/" + id + ".md");
    }
  }
  const receipt = {
    ...input,
    recordedAt: new Date().toISOString(),
    deckSha256: hash(text("course/deck.json")),
    evidenceSha256: Object.fromEntries([...evidence].sort().map(file => [file,hash(text(file))]))
  };
  fs.writeFileSync("course/review.json", JSON.stringify(receipt,null,2)+"\n");
}
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  if (process.argv.includes("--record")) recordReviewedContent();
  verifyReviewedContent();
}
