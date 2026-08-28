export const defaultStyle = `:root {
  color-scheme: light;
  --bg: #f6f1e8;
  --surface: #fffcf5;
  --ink: #24201a;
  --muted: #857c6e;
  --accent: #c05a2a;
  --accent-soft: #f2ddcc;
  --border: #e6ddcc;
  --code-bg: #2b251d;
  --code-ink: #f5efe3;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--ink);
  background: var(--bg);
}
* { box-sizing: border-box; }
body {
  margin: 0;
  line-height: 1.65;
}
.layout {
  display: flex;
  min-height: 100vh;
  max-width: 68rem;
  margin: 0 auto;
}
.sidebar {
  width: 15rem;
  flex: none;
  padding: 2rem 1.25rem;
  border-right: 1px solid var(--border);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.brand {
  display: block;
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  text-decoration: none;
  color: var(--ink);
  margin-bottom: 1.5rem;
}
.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.sidebar nav a {
  display: block;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  color: var(--muted);
  font-weight: 500;
  text-decoration: none;
}
.sidebar nav a:hover {
  color: var(--ink);
  background: var(--accent-soft);
}
.sidebar nav a.active {
  color: var(--accent);
  background: var(--accent-soft);
  font-weight: 600;
}
a {
  color: var(--accent);
  text-decoration: none;
}
main {
  flex: 1;
  min-width: 0;
  padding: 2.5rem 2.75rem 4rem;
}
@media (max-width: 760px) {
  .layout {
    flex-direction: column;
  }
  .sidebar {
    position: static;
    width: auto;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding: 1.25rem;
  }
  .brand {
    margin-bottom: 0.75rem;
  }
  main {
    padding: 1.5rem;
  }
}
h1, h2, h3 {
  letter-spacing: -0.02em;
  line-height: 1.2;
}
h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem;
}
h2 {
  font-size: 1.5rem;
  margin-top: 2.5rem;
}
h3 {
  font-size: 1.15rem;
  margin-top: 1.75rem;
}
blockquote {
  margin: 1.25rem 0;
  padding: 0.25rem 1.25rem;
  border-left: 3px solid var(--accent);
  color: var(--muted);
  font-size: 1.15rem;
}
code {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.9em;
  background: var(--accent-soft);
  padding: 0.15em 0.4em;
  border-radius: 6px;
}
pre {
  background: var(--code-bg);
  color: var(--code-ink);
  padding: 1.25rem;
  border-radius: 12px;
  overflow-x: auto;
  line-height: 1.5;
}
pre code {
  background: none;
  padding: 0;
  color: inherit;
}
.demo {
  margin: 1.5rem 0;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  box-shadow: 0 1px 2px rgba(36, 32, 26, 0.05);
}
.demo button {
  margin-left: 0.75rem;
  padding: 0.35rem 0.85rem;
  border: 1px solid var(--accent);
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
.demo button:hover {
  filter: brightness(1.06);
}
/* syntax highlighting */
.hljs-comment,
.hljs-quote { color: #8a7f6b; font-style: italic; }
.hljs-keyword,
.hljs-literal { color: #e08f5b; }
.hljs-string { color: #a9bd7a; }
.hljs-number,
.hljs-built_in { color: #d6a85c; }
.hljs-title,
.hljs-title.function_,
.hljs-title.class_ { color: #e6b06e; }
.hljs-attr,
.hljs-variable,
.hljs-variable.language_,
.hljs-function { color: #dcc9a8; }
.hljs-property,
.hljs-params { color: #c7b48c; }
`;
