import { css, html } from "lit";
import { spreadAttributes } from "~/utils";
import { BaseElement } from "./base";

export class Button extends BaseElement {
  static styles = [
    ...super.styles,
    css`
      button {
        outline: none;
      }
    `,
  ];

  render() {
    return html`
      <button type="submit">
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("fui-button", Button);
