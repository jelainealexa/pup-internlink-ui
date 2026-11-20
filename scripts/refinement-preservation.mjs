import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const baseline = "e9028f9f05d6a6de0cd387701b0089a6f2d626ae";
const result = {
  baseline,
  preservedBranch: git("rev-parse", "frontend/interface-update"),
  currentBranch: git("branch", "--show-current"),
  currentHead: git("rev-parse", "HEAD"),
  optimizedHead: git(
    "-C",
    "../pup-internlink-ui-optimized",
    "rev-parse",
    "HEAD",
  ),
  optimizedStatus: git(
    "-C",
    "../pup-internlink-ui-optimized",
    "status",
    "--porcelain",
  ),
  unchangedFunctionalFiles:
    git(
      "diff",
      baseline,
      "--name-only",
      "--",
      "app/lib",
      "app/components/AppProvider.tsx",
      "package.json",
      "package-lock.json",
      "tsconfig.json",
      "docs/REQUIREMENTS.md",
      "docs/REQUIREMENTS_TRACEABILITY.md",
    ) === "",
  pdfs: [],
  sites: [],
};
const hashes = JSON.parse(
  await readFile("docs/evidence/refinement/source-hashes.json", "utf8"),
);
for (const entry of hashes.filter((entry) => entry.Path.endsWith(".pdf"))) {
  const hash = createHash("sha256")
    .update(await readFile(entry.Path))
    .digest("hex")
    .toUpperCase();
  result.pdfs.push({ path: entry.Path, hash, unchanged: hash === entry.Hash });
}
for (const port of [3000, 3001]) {
  const response = await fetch(`http://localhost:${port}/`);
  const html = await response.text();
  result.sites.push({
    port,
    status: response.status,
    title: html.match(/<title>(.*?)<\/title>/)?.[1],
  });
}
await writeFile(
  "docs/evidence/refinement/preservation.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result, null, 2));
if (
  result.preservedBranch !== baseline ||
  !result.unchangedFunctionalFiles ||
  result.optimizedStatus ||
  result.pdfs.some((p) => !p.unchanged) ||
  result.sites.some((s) => s.status !== 200)
)
  process.exitCode = 1;
