import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const root = process.cwd();
const targets = ["node_modules", "package-lock.json", "yarn.lock", "pnpm-lock.yaml"];

for (const t of targets) {
  const p = path.join(root, t);
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

const r = spawnSync("npm", ["install"], { stdio: "inherit", shell: true });
process.exit(r.status ?? 1);