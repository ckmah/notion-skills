import { test } from "node:test";
import assert from "node:assert/strict";
import { homedir } from "node:os";
import { isAbsolute, join } from "node:path";
import { KNOWN_TARGETS, findTargetByKey } from "../dist/known-targets.js";

const HOME = homedir();

test("registry contains all supported targets", () => {
  const keys = KNOWN_TARGETS.map((t) => t.key).sort();
  assert.deepEqual(
    keys,
    ["agents", "claude", "codex", "cursor", "gemini", "opencode"],
  );
});

test("agents target sorts first in registry order", () => {
  // KNOWN_TARGETS order drives migrate's canonical-wins priority.
  // The generic catch-all should win, so it must be index 0.
  assert.equal(KNOWN_TARGETS[0].key, "agents");
});

test("every target has a non-empty label and dir", () => {
  for (const t of KNOWN_TARGETS) {
    assert.ok(t.label.length > 0, `label missing for ${t.key}`);
    assert.ok(t.dir.length > 0, `dir missing for ${t.key}`);
  }
});

test("all target dirs are absolute paths under HOME or XDG", () => {
  for (const t of KNOWN_TARGETS) {
    assert.ok(isAbsolute(t.dir), `${t.key} dir should be absolute`);
  }
});

test("claude path", () => {
  assert.equal(findTargetByKey("claude")?.dir, join(HOME, ".claude", "skills"));
});

test("codex path", () => {
  assert.equal(findTargetByKey("codex")?.dir, join(HOME, ".codex", "skills"));
});

test("opencode path follows XDG", () => {
  const xdg = process.env.XDG_CONFIG_HOME || join(HOME, ".config");
  assert.equal(findTargetByKey("opencode")?.dir, join(xdg, "opencode", "skills"));
});

test("cursor path", () => {
  assert.equal(findTargetByKey("cursor")?.dir, join(HOME, ".cursor", "skills"));
});

test("gemini path", () => {
  assert.equal(findTargetByKey("gemini")?.dir, join(HOME, ".gemini", "skills"));
});

test("findTargetByKey: unknown returns undefined", () => {
  assert.equal(findTargetByKey("does-not-exist"), undefined);
});

test("each target with a docs URL is well-formed", () => {
  // Docs are optional (the generic ~/.agents catch-all has no canonical
  // doc page), but if a target ships one it must look like a URL.
  for (const t of KNOWN_TARGETS) {
    if (t.docs === undefined) continue;
    assert.match(t.docs, /^https?:\/\//);
  }
});

test("agents path", () => {
  assert.equal(findTargetByKey("agents")?.dir, join(HOME, ".agents", "skills"));
});
