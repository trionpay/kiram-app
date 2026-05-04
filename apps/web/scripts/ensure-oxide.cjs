const { spawnSync } = require("node:child_process");
const { createRequire } = require("node:module");
const path = require("node:path");
const fs = require("node:fs");

const requireFromCwd = createRequire(path.join(process.cwd(), "package.json"));
const ENDPOINT = "http://127.0.0.1:7703/ingest/b743fe82-8de1-4e32-9f76-3d75129277ea";
const SESSION_ID = "dd7aca";
const runId = `${Date.now()}-${process.env.RAILWAY_GIT_COMMIT_SHA || process.env.SOURCE_VERSION || "local"}`;
const pendingLogs = [];

function debugLog(hypothesisId, location, message, data) {
  const payload = {
    sessionId: SESSION_ID,
    runId,
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now()
  };
  // #region agent log
  const request = fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": SESSION_ID
    },
    body: JSON.stringify(payload)
  }).catch(() => {});
  pendingLogs.push(request);
  // Also print structured evidence to CI logs.
  console.log(`[ensure-oxide][${hypothesisId}] ${message} ${JSON.stringify(data)}`);
  // #endregion
}

function canResolve(mod) {
  try {
    requireFromCwd.resolve(mod);
    return true;
  } catch {
    return false;
  }
}

function getState() {
  const detectedLibc = process.platform === "linux"
    ? (fs.existsSync("/lib/ld-musl-x86_64.so.1") || fs.existsSync("/etc/alpine-release") ? "musl" : "glibc")
    : null;
  return {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    libc: detectedLibc,
    cwd: process.cwd(),
    initCwd: process.env.INIT_CWD || null,
    npmConfigProduction: process.env.NPM_CONFIG_PRODUCTION || process.env.npm_config_production || null,
    npmConfigOmit: process.env.NPM_CONFIG_OMIT || process.env.npm_config_omit || null,
    oxideResolvable: canResolve("@tailwindcss/oxide"),
    oxideGnuResolvable: canResolve("@tailwindcss/oxide-linux-x64-gnu/package.json"),
    oxideMuslResolvable: canResolve("@tailwindcss/oxide-linux-x64-musl/package.json")
  };
}

function runInstall(pkg) {
  const result = spawnSync("npm", ["install", "--no-save", pkg], {
    env: { ...process.env, npm_config_optional: "true" },
    encoding: "utf8",
    stdio: "pipe"
  });
  return {
    package: pkg,
    status: result.status,
    error: result.error ? String(result.error) : null,
    stdoutTail: (result.stdout || "").slice(-500),
    stderrTail: (result.stderr || "").slice(-500)
  };
}

async function main() {
  // #region agent log
  debugLog("H1", "apps/web/scripts/ensure-oxide.cjs:84", "prebuild_start", getState());
  // #endregion

  if (process.platform !== "linux" || process.arch !== "x64") {
    // #region agent log
    debugLog("H2", "apps/web/scripts/ensure-oxide.cjs:100", "linux_binding_install_skipped_non_linux_x64", getState());
    // #endregion
    await Promise.allSettled(pendingLogs);
    return;
  }

  const stateBeforeInstall = getState();
  const primaryPkg = stateBeforeInstall.libc === "musl"
    ? "@tailwindcss/oxide-linux-x64-musl@4.2.1"
    : "@tailwindcss/oxide-linux-x64-gnu@4.2.1";
  const fallbackPkg = stateBeforeInstall.libc === "musl"
    ? "@tailwindcss/oxide-linux-x64-gnu@4.2.1"
    : "@tailwindcss/oxide-linux-x64-musl@4.2.1";

  const primaryInstall = runInstall(primaryPkg);
  // #region agent log
  debugLog("H2", "apps/web/scripts/ensure-oxide.cjs:116", "primary_linux_binding_install_result", {
    ...primaryInstall,
    stateAfter: getState()
  });
  // #endregion

  if (!canResolve("@tailwindcss/oxide-linux-x64-gnu/package.json") && !canResolve("@tailwindcss/oxide-linux-x64-musl/package.json")) {
    const fallbackInstall = runInstall(fallbackPkg);
    // #region agent log
    debugLog("H3", "apps/web/scripts/ensure-oxide.cjs:125", "fallback_linux_binding_install_result", {
      ...fallbackInstall,
      stateAfter: getState()
    });
    // #endregion
  }

  // #region agent log
  debugLog("H4", "apps/web/scripts/ensure-oxide.cjs:133", "prebuild_end_state", getState());
  // #endregion

  await Promise.allSettled(pendingLogs);
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(0));
