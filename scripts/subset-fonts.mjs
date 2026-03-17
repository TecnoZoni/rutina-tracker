import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const root = process.cwd();
const fontsDir = path.join(root, "assets", "fonts");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupRoot = path.join(root, "scripts", "font-backups", stamp);
const unicodeRange = process.env.UNICODES || "U+0020-007E";

const fontExts = new Set([".ttf", ".otf"]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) walk(path.join(dir, entry.name), files);
    else files.push(path.join(dir, entry.name));
  }
  return files;
}

function backupFile(file) {
  const rel = path.relative(root, file);
  const dest = path.join(backupRoot, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!fs.existsSync(dest)) fs.copyFileSync(file, dest);
}

if (!fs.existsSync(fontsDir)) {
  console.log("assets/fonts not found, skipping");
  process.exit(0);
}

const fontFiles = walk(fontsDir).filter((f) => fontExts.has(path.extname(f).toLowerCase()));
for (const file of fontFiles) {
  const tmp = `${file}.subset`;
  const r = spawnSync(
    "python",
    ["-m", "fonttools", "subset", file, `--output-file=${tmp}`, `--unicodes=${unicodeRange}`],
    { stdio: "inherit", shell: true }
  );
  if (r.status === 0 && fs.existsSync(tmp)) {
    backupFile(file);
    fs.renameSync(tmp, file);
  } else if (fs.existsSync(tmp)) {
    fs.unlinkSync(tmp);
  }
}
