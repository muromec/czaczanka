import { test, expect } from "bun:test";
import { mkdtemp, writeFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { build } from "../src/index.js";

test("renders markdown to html and emits the demo directive", async () => {
  const dir = await mkdtemp(join(tmpdir(), "czaczanka-"));
  await mkdir(join(dir, "content", "1.guide"), { recursive: true });
  await writeFile(join(dir, "content", "1.guide", "1.index.md"), "# Hello\n\n::demo{counter}\n");

  const pages = await build({ cwd: dir, name: "test" });

  expect(pages).toHaveLength(1);
  expect(pages[0].outPath).toBe("guide/index.html");
  expect(pages[0].url).toBe("/guide/");

  const html = await readFile(join(dir, "dist", "guide", "index.html"), "utf8");
  expect(html).toContain("<h1>Hello</h1>");
  expect(html).toContain('<div class="demo" data-demo="counter"></div>');
  expect(html).toContain("<title>Hello · test</title>");
});

test("strips numeric prefixes from urls", async () => {
  const dir = await mkdtemp(join(tmpdir(), "czaczanka-"));
  await mkdir(join(dir, "content", "2.api"), { recursive: true });
  await writeFile(join(dir, "content", "2.api", "1.build.md"), "# build()\n");

  const pages = await build({ cwd: dir, name: "test" });

  expect(pages[0].outPath).toBe("api/build.html");
  expect(pages[0].url).toBe("/api/build.html");
});
