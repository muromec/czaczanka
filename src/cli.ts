#!/usr/bin/env node
import { build, type BuildOptions } from "./build.js";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const opts: BuildOptions = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--content" || arg === "-c") opts.contentDir = args[++i];
    else if (arg === "--out" || arg === "-o") opts.outDir = args[++i];
    else if (arg === "--name") opts.name = args[++i];
  }
  const pages = await build(opts);
  console.log(`czaczanka: built ${pages.length} page(s) → ${opts.outDir ?? "dist"}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
