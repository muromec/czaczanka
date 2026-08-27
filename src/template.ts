export interface LayoutVars {
  name: string;
  title: string;
  nav: string;
  content: string;
  hasClient: boolean;
}

export function renderLayout(v: LayoutVars): string {
  const script = v.hasClient ? '<script type="module" src="/assets/client.js"></script>' : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${v.title} · ${v.name}</title>
<link rel="stylesheet" href="/assets/style.css">
</head>
<body>
<header><a class="brand" href="/">${v.name}</a><nav>${v.nav}</nav></header>
<main>${v.content}</main>
${script}
</body>
</html>`;
}
