import { createApp, type Component } from "vue";

/**
 * Mount Vue widgets onto every `[data-demo]` element on the page, keyed by
 * the element's `data-demo` attribute. Call this from your client entry:
 *
 * ```js
 * import { mountWidgets } from "czaczanka/runtime";
 * import { widgets } from "./widgets.js";
 * mountWidgets(widgets);
 * ```
 */
export function mountWidgets(widgets: Record<string, Component>): void {
  for (const el of document.querySelectorAll("[data-demo]")) {
    const name = el.getAttribute("data-demo");
    if (name && widgets[name]) {
      createApp(widgets[name]).mount(el);
    }
  }
}
