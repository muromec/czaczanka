import { readdir, readFile, mkdir, writeFile, rm, access, copyFile } from "node:fs/promises";
import { constants } from "node:fs";
import { join, relative, dirname, basename, resolve } from "node:path";
import { build as esbuildBuild } from "esbuild";
import { createMarkdown } from "./markdown.js";
import { renderLayout } from "./template.js";
import { defaultStyle } from "./style.js";

export interface BuildOptions {
  /** Project root. Defaults to `process.cwd()`. */
  cwd?: string;
  /** Markdown source directory. Defaults to `content`. */
  contentDir?: string;
  /** Output directory. Defaults to `dist`. */
  outDir?: string;
  /** Path to the client JS entry. Defaults to `client.js` (or `.ts`) if present. */
  clientEntry?: string;
  /** Site name. Defaults to the project `package.json` name. */
  name?: string;
}

export interface BuiltPage {
  /** Output path relative to `outDir`. */
  outPath: string;
  title: string;
  /** Site-relative URL. */
  url: string;
}

const stripPrefix = (s: string): string => s.replace(/^\d+\./, "");

async function exists(p: string): Promise<boolean> {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (entry.name.endsWith(".md")) out.push(p);
  }
  return out;
}

async function readPackageName(cwd: string): Promise<string | undefined> {
  try {
    const raw = await readFile(join(cwd, "package.json"), "utf8");
    return (JSON.parse(raw) as { name?: string }).name;
  } catch {
    return undefined;
  }
}

export async function build(opts: BuildOptions = {}): Promise<BuiltPage[]> {
  const cwd = resolve(opts.cwd ?? process.cwd());
  const contentDir = resolve(cwd, opts.contentDir ?? "content");
  const outDir = resolve(cwd, opts.outDir ?? "dist");
  const name = opts.name ?? (await readPackageName(cwd)) ?? "docs";

  const md = createMarkdown();
  const files = await walk(contentDir);

  const pages: BuiltPage[] = [];
  const rendered: Array<BuiltPage & { html: string }> = [];

  for (const file of files) {
    const raw = await readFile(file, "utf8");
    const html = md.render(raw);
    const title = (raw.match(/^# (.+)$/m) ?? [])[1] ?? basename(file, ".md");
    const parts = relative(contentDir, file).split("/").map(stripPrefix);

    let outPath: string;
    if (parts[parts.length - 1] === "index.md") {
      outPath = [...parts.slice(0, -1), "index.html"].join("/");
    } else {
      outPath = parts.join("/").replace(/\.md$/, ".html");
    }
    const url = "/" + outPath.replace(/\/?index\.html$/, "/");

    const page = { outPath, title, url };
    pages.push(page);
    rendered.push({ ...page, html });
  }

  const nav = pages.map((p) => `<a href="${p.url}">${p.title}</a>`).join("");

  let clientEntry = opts.clientEntry;
  if (!clientEntry) {
    if (await exists(resolve(cwd, "client.js"))) clientEntry = resolve(cwd, "client.js");
    else if (await exists(resolve(cwd, "client.ts"))) clientEntry = resolve(cwd, "client.ts");
  }
  const hasClient = Boolean(clientEntry);

  await rm(outDir, { recursive: true, force: true });

  for (const p of rendered) {
    const dest = join(outDir, p.outPath);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, renderLayout({ name, title: p.title, nav, content: p.html, hasClient }));
  }

  const assetsDir = join(outDir, "assets");
  await mkdir(assetsDir, { recursive: true });

  if (clientEntry) {
    await esbuildBuild({
      entryPoints: [clientEntry],
      bundle: true,
      outfile: join(assetsDir, "client.js"),
      format: "esm",
      platform: "browser",
      absWorkingDir: cwd,
    });
  }

  const styleOverride = resolve(cwd, "style.css");
  if (await exists(styleOverride)) {
    await copyFile(styleOverride, join(assetsDir, "style.css"));
  } else {
    await writeFile(join(assetsDir, "style.css"), defaultStyle);
  }

  return pages;
}
