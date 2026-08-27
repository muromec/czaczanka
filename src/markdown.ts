import MarkdownIt from "markdown-it";

/**
 * A markdown-it instance with the `::demo{name}` inline rule, which emits a
 * `<div class="demo" data-demo="name">` mount point for the client runtime.
 */
export function createMarkdown(): MarkdownIt {
  const md = new MarkdownIt({ html: true, linkify: true });

  md.inline.ruler.before("emphasis", "demo", (state, silent) => {
    const start = state.pos;
    if (!state.src.startsWith("::demo{", start)) return false;
    const end = state.src.indexOf("}", start);
    if (end === -1) return false;
    if (!silent) {
      const name = state.src.slice(start + 7, end);
      const token = state.push("html_inline", "", 0);
      token.content = `<div class="demo" data-demo="${name}"></div>`;
    }
    state.pos = end + 1;
    return true;
  });

  return md;
}
