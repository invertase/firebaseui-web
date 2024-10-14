import { html } from "lit";
import { spreadAttributes } from "~/utils";
import { BaseElement } from "./base";

export class Button extends BaseElement {
  render() {
    return html`
      <button
        ...="${spreadAttributes(this.attributes)}"
        class="${this.cn(
          "bg-theme hover:bg-theme/70 text-sm font-medium text-theme-foreground transition-all rounded px-4 py-2"
        )}"
      >
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("fui-button", Button);
