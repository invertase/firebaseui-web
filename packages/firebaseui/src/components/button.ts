import { css, html, LitElement } from "lit";
import { spreadAttributes } from "~/utils";
import { BaseElement } from "./base";

export class Button extends BaseElement {
  static styles = [
    ...BaseElement.styles,
    css`
      button {
        border-radius: var(--theme-radius);
        background-color: var(--theme-primary);
      }
    `,
  ];

  render() {
    return html`
      <button ...="${spreadAttributes(this.attributes)}">
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("fui-button", Button);
