export interface NavItem {
  url: string;
  title: string;
}

export interface LayoutVars {
  name: string;
  title: string;
  nav: NavItem[];
  content: string;
  hasClient: boolean;
  /** Site-relative URL of the page being rendered, for nav active state. */
  currentUrl: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderLayout(v: LayoutVars): string {
  const script = v.hasClient ? '<script type="module" src="/assets/client.js"></script>' : "";
  const links = v.nav
    .map((item) => {
      const active = item.url === v.currentUrl ? ' class="active"' : "";
      return `      <a href="${escapeHtml(item.url)}"${active}>${escapeHtml(item.title)}</a>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(v.title)} · ${escapeHtml(v.name)}</title>
<link rel="stylesheet" href="/assets/style.css">
</head>
<body>
<div class="layout">
  <aside class="sidebar">
    <a class="brand" href="/">${escapeHtml(v.name)}</a>
    <nav>
${links}
    </nav>
  </aside>
  <main>${v.content}</main>
</div>
${script}
</body>
</html>`;
}
