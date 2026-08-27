# czaczanka

Markdown + Vue widgets → static docs site.

Markdown files become HTML pages; `::demo{name}` directives become Vue widget
mount points. Built on `markdown-it` + `esbuild` — no framework, no bundler
config, no native toolchain.

## Layout

```
docs/
├─ content/1.guide/1.index.md   → /guide/
├─ client.js                    # optional: mounts your Vue widgets
└─ style.css                    # optional: overrides the default styles
```

Numeric prefixes (`1.guide`, `1.index`) are stripped from URLs to control
sidebar order.

## Quick start

```sh
mkdir docs && cd docs
npm init -y
npm i -D czaczanka
mkdir -p content/1.guide
cat > content/1.guide/1.index.md <<'MD'
# Quick Start

::demo{counter}
MD
npx czaczanka
# → dist/guide/index.html
```

## Live demos

Create a `client.js` that registers your Vue widgets against the runtime:

```js
import { mountWidgets } from "czaczanka/runtime";
import { h, ref, defineComponent } from "vue";

const Counter = defineComponent({
  setup() {
    const count = ref(0);
    return () => h("div", [
      h("p", `count: ${count.value}`),
      h("button", { onClick: () => count.value++ }, "POKE"),
    ]);
  },
});

mountWidgets({ counter: Counter });
```

Then `::demo{counter}` in any page mounts the `Counter` widget.

## API

`build(options)` — render a docs site. Options:

- `cwd` — project root (default `process.cwd()`)
- `contentDir` — markdown source dir (default `content`)
- `outDir` — output dir (default `dist`)
- `clientEntry` — path to the client JS entry (default: `client.js` if present)
- `name` — site name (default: the project's `package.json` name)

```js
import { build } from "czaczanka";

await build({ contentDir: "docs", outDir: "public", name: "My docs" });
```
