import path from "path";
import { spawnSync } from "child_process";

const root = process.cwd();
const gradleDir = path.join(root, "android");
const gradlew = process.platform === "win32" ? "gradlew.bat" : "./gradlew";

const r = spawnSync(gradlew, ["assembleRelease", "--no-daemon"], {
  cwd: gradleDir,
  stdio: "inherit",
  shell: true,
});
process.exit(r.status ?? 1);