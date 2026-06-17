import { test } from "node:test";
import assert from "node:assert/strict";
import { join, sep } from "node:path";
import { isInsideDir } from "../dist/path-utils.js";

// Build paths with the platform separator so the suite is meaningful on
// both POSIX (`/`) and Windows (`\`). The bug these guard against was a
// hardcoded "/" prefix check that never matched Windows backslash paths.
const root = join(sep, "tmp", "store");

test("isInsideDir: equal paths count as inside", () => {
  assert.equal(isInsideDir(root, root), true);
});

test("isInsideDir: nested child is inside", () => {
  assert.equal(isInsideDir(join(root, "skill-a"), root), true);
  assert.equal(isInsideDir(join(root, "a", "b", "c"), root), true);
});

test("isInsideDir: parent is not inside its own child", () => {
  assert.equal(isInsideDir(root, join(root, "skill-a")), false);
});

test("isInsideDir: sibling sharing a name prefix is not inside", () => {
  // The old `startsWith(parent + sep)` style would wrongly match a
  // sibling like ".../store-backup" against ".../store".
  assert.equal(isInsideDir(join(sep, "tmp", "store-backup"), root), false);
});

test("isInsideDir: unrelated path is not inside", () => {
  assert.equal(isInsideDir(join(sep, "etc", "passwd"), root), false);
});
