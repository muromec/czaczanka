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

test("demo directive is block-level (not wrapped in a paragraph)", async () => {
  const dir = await mkdtemp(join(tmpdir(), "czaczanka-"));
  await mkdir(join(dir, "content"), { recursive: true });
  await writeFile(join(dir, "content", "index.md"), "# Home\n\n::demo{counter}\n");

  await build({ cwd: dir, name: "test" });

  const html = await readFile(join(dir, "dist", "index.html"), "utf8");
  expect(html).toContain('<div class="demo" data-demo="counter"></div>');
  expect(html).not.toContain('<p><div class="demo"');
});

test("strips numeric prefixes from urls", async () => {
  const dir = await mkdtemp(join(tmpdir(), "czaczanka-"));
  await mkdir(join(dir, "content", "2.api"), { recursive: true });
  await writeFile(join(dir, "content", "2.api", "1.build.md"), "# build()\n");

  const pages = await build({ cwd: dir, name: "test" });

  expect(pages[0].outPath).toBe("api/build.html");
  expect(pages[0].url).toBe("/api/build.html");
});

test("root index.md becomes the landing page and is excluded from nav", async () => {
  const dir = await mkdtemp(join(tmpdir(), "czaczanka-"));
  await mkdir(join(dir, "content", "1.guide"), { recursive: true });
  await writeFile(join(dir, "content", "index.md"), "# posipaki\n\nWelcome.\n");
  await writeFile(join(dir, "content", "1.guide", "1.index.md"), "# Quick Start\n");

  const pages = await build({ cwd: dir, name: "posipaki" });

  expect(pages.map((p) => p.outPath).sort()).toEqual(["guide/index.html", "index.html"]);

  const landing = pages.find((p) => p.outPath === "index.html");
  expect(landing?.url).toBe("/");

  const html = await readFile(join(dir, "dist", "index.html"), "utf8");
  // brand links home, nav does not repeat the landing page
  expect(html).toContain('<a class="brand" href="/">posipaki</a>');
  expect(html).not.toContain('<a href="/">posipaki</a>');
  expect(html).toContain('<a href="/guide/">Quick Start</a>');
});

test("vue is a peer dependency, not a runtime dependency", async () => {
  const pkg = JSON.parse(await readFile(join(import.meta.dir, "..", "package.json"), "utf8"));
  // A runtime vue dep causes a second Vue copy to nest under czaczanka when
  // installed as a file: dependency, breaking the widget's reactivity.
  expect(pkg.dependencies?.vue).toBeUndefined();
  expect(pkg.peerDependencies?.vue).toBeTruthy();
  expect(pkg.devDependencies?.vue).toBeTruthy();
});

test("highlights TypeScript fences, leaves others plain", async () => {
  const dir = await mkdtemp(join(tmpdir(), "czaczanka-"));
  await mkdir(join(dir, "content"), { recursive: true });
  await writeFile(
    join(dir, "content", "index.md"),
    "# Hi\n\n```ts\nconst x: number = 1;\n```\n\n```sh\nnpm install posipaki\n```\n",
  );

  await build({ cwd: dir, name: "test" });

  const html = await readFile(join(dir, "dist", "index.html"), "utf8");
  // TypeScript fence is highlighted
  expect(html).toContain('<span class="hljs-keyword">const</span>');
  expect(html).toContain('<span class="hljs-number">1</span>');
  // shell fence is escaped but not highlighted
  expect(html).toContain("npm install posipaki");
  // shell is left as plain text, with no hljs spans
  expect(html).not.toMatch(/<span class="hljs-.*">npm/);
});

test("renders a sidebar nav with the current page marked active", async () => {
  const dir = await mkdtemp(join(tmpdir(), "czaczanka-"));
  await mkdir(join(dir, "content", "1.guide"), { recursive: true });
  await mkdir(join(dir, "content", "2.api"), { recursive: true });
  await writeFile(join(dir, "content", "1.guide", "1.index.md"), "# Quick Start\n");
  await writeFile(join(dir, "content", "2.api", "1.index.md"), "# API Reference\n");

  await build({ cwd: dir, name: "test" });

  const api = await readFile(join(dir, "dist", "api", "index.html"), "utf8");
  expect(api).toContain('<aside class="sidebar">');
  expect(api).toContain('<a class="brand" href="/">test</a>');
  expect(api).toContain('<a href="/guide/">Quick Start</a>');
  expect(api).toContain('<a href="/api/" class="active">API Reference</a>');

  const guide = await readFile(join(dir, "dist", "guide", "index.html"), "utf8");
  expect(guide).toContain('<a href="/guide/" class="active">Quick Start</a>');
  expect(guide).toContain('<a href="/api/">API Reference</a>');
});
