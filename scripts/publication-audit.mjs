import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const files = git("ls-files", "-z").split("\0").filter(Boolean);
const forbiddenFiles = files.filter((file) =>
  /(^|\/)(node_modules|\.next[^/]*|\.vercel|\.env[^/]*)(\/|$)|\.(pem|key)$/.test(
    file,
  ),
);
const rules = {
  githubToken: /\b(?:gh[opusr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})/g,
  vercelToken: /\bvercel_[A-Za-z0-9]{30,}/g,
  privateKey: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g,
};
const secretFindings = [];
for (const file of files) {
  const contents = await readFile(file, "utf8");
  for (const [rule, expression] of Object.entries(rules)) {
    expression.lastIndex = 0;
    const matches = Array.from(contents.matchAll(expression));
    if (matches.length)
      secretFindings.push({ file, rule, count: matches.length });
  }
}
const result = {
  reviewedCommit: git("rev-parse", "HEAD"),
  branch: git("branch", "--show-current"),
  trackedFiles: files.length,
  forbiddenFiles,
  secretFindings,
  trackedPdfs: files.filter((file) => /\.pdf$/i.test(file)),
  ownerPdfsTracked: files.filter((file) =>
    /(?:PUP INTERNLINK_System Flow|DSI - Interface Content)\.pdf$/i.test(file),
  ),
  localMain: git("rev-parse", "main"),
  originalApplicationUnchanged:
    git(
      "-C",
      "../pup-internlink-ui",
      "status",
      "--porcelain",
      "--untracked-files=no",
    ) === "",
  originalHead: git("-C", "../pup-internlink-ui", "rev-parse", "HEAD"),
  optimizedStatus: git(
    "-C",
    "../pup-internlink-ui-optimized",
    "status",
    "--porcelain",
  ),
  optimizedHead: git(
    "-C",
    "../pup-internlink-ui-optimized",
    "rev-parse",
    "HEAD",
  ),
};
const response = await fetch("https://pup-internlink-ui.vercel.app/dashboard");
const html = await response.text();
const assets = [
  ...html.matchAll(/(?:src|href)="([^"]+\.(?:css|js)(?:\?[^"]*)?)"/g),
]
  .map((match) => match[1])
  .sort();
result.originalDeployment = {
  status: response.status,
  assets,
  assetManifestHash: createHash("sha256")
    .update(JSON.stringify(assets))
    .digest("hex"),
};
const output = process.argv[2] ?? "docs/evidence/publication/audit.json";
await writeFile(output, JSON.stringify(result, null, 2) + "\n");
console.log(
  JSON.stringify(
    {
      ...result,
      originalDeployment: {
        status: response.status,
        assetManifestHash: result.originalDeployment.assetManifestHash,
      },
    },
    null,
    2,
  ),
);
if (
  forbiddenFiles.length ||
  secretFindings.length ||
  result.ownerPdfsTracked.length
)
  process.exitCode = 1;
