import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

/**
 * Highlight TypeScript code fences. Everything else is left to markdown-it's
 * default (escaped, unhighlighted) rendering.
 */
function highlight(code: string, lang: string): string {
  const language = lang === "ts" ? "typescript" : lang;
  if (language !== "typescript") return "";
  try {
    return hljs.highlight(code, { language: "typescript" }).value;
  } catch {
    return "";
  }
}

/**
 * A markdown-it instance with a `::demo{name}` block rule, which emits a
 * block-level `<div class="demo" data-demo="name">` mount point for the
 * client runtime. Being block-level (rather than inline) keeps markdown-it
 * from wrapping the mount point in a stray `<p>`.
 */
export function createMarkdown(): MarkdownIt {
  const md = new MarkdownIt({ html: true, linkify: true, highlight });

  md.block.ruler.before("paragraph", "demo", (state, startLine, _endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const line = state.src.slice(start, max).trim();
    const match = /^::demo\{([^}]*)\}$/.exec(line);
    if (!match) return false;
    if (silent) return true;

    const token = state.push("html_block", "", 0);
    token.map = [startLine, startLine + 1];
    token.content = `<div class="demo" data-demo="${match[1]}"></div>\n`;
    state.line = startLine + 1;
    return true;
  });

  return md;
}
