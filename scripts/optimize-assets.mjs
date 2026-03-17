import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const root = process.cwd();
const assetsDir = path.join(root, "assets");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupRoot = path.join(root, "scripts", "asset-backups", stamp);

const imageExts = new Set([".png", ".jpg", ".jpeg"]);
const textExts = new Set([".js", ".jsx", ".ts", ".tsx", ".json"]);
const skipDirs = new Set(["node_modules", ".git", ".expo", "android", "ios", "dist", "build"]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      walk(path.join(dir, entry.name), files);
    } else {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

function backupFile(file) {
  const rel = path.relative(root, file);
  const dest = path.join(backupRoot, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!fs.existsSync(dest)) fs.copyFileSync(file, dest);
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: true });
  return r.status === 0;
}

if (!fs.existsSync(assetsDir)) {
  console.error("assets/ not found");
  process.exit(1);
}

const skipFiles = new Set();
const appJsonPath = path.join(root, "app.json");
if (fs.existsSync(appJsonPath)) {
  try {
    const appConfig = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
    const stack = [appConfig];
    while (stack.length) {
      const value = stack.pop();
      if (typeof value === "string" && /\.(png|jpe?g)$/i.test(value)) {
        const abs = path.isAbsolute(value)
          ? value
          : path.resolve(root, value.replace(/^\.?\//, ""));
        skipFiles.add(path.normalize(abs));
      } else if (Array.isArray(value)) {
        for (const item of value) stack.push(item);
      } else if (value && typeof value === "object") {
        for (const key of Object.keys(value)) stack.push(value[key]);
      }
    }
  } catch (e) {
    console.error("Failed to parse app.json, continuing without skips");
  }
}

const replacements = new Map();
const assetFiles = walk(assetsDir);

for (const file of assetFiles) {
  const ext = path.extname(file).toLowerCase();
  if (!imageExts.has(ext)) continue;
  if (skipFiles.has(path.normalize(file))) continue;

  const rel = path.relative(root, file).replace(/\\/g, "/");
  const webp = file.replace(/\.(png|jpe?g)$/i, ".webp");
  const webpRel = path.relative(root, webp).replace(/\\/g, "/");

  backupFile(file);

  const ok = run("cwebp", ["-q", "80", file, "-o", webp]);
  if (ok && fs.existsSync(webp)) {
    fs.unlinkSync(file);
    replacements.set(rel, webpRel);
    replacements.set(`./${rel}`, `./${webpRel}`);
  } else if (ext === ".png") {
    run("pngquant", ["--quality=65-80", "--speed", "1", "--strip", "--force", "--output", file, file]);
    run("oxipng", ["-o", "4", file]);
  }
}

const textFiles = walk(root).filter((f) => textExts.has(path.extname(f).toLowerCase()));
for (const file of textFiles) {
  if (file.includes(`${path.sep}node_modules${path.sep}`)) continue;
  const data = fs.readFileSync(file, "utf8");
  let next = data;
  for (const [from, to] of replacements.entries()) {
    next = next.split(from).join(to);
  }
  if (next !== data) {
    backupFile(file);
    fs.writeFileSync(file, next);
  }
}
