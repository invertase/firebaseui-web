import { html } from "lit";
import { spreadAttributes } from "~/utils";
import { BaseElement } from "./base";

export class Input extends BaseElement {
  render() {
    return html`
      <input ...="${spreadAttributes(this.attributes)}" class="${this.cn(
      "rounded focus:outline-theme px-4 py-2"
    )}"></input>
    `;
  }
}

customElements.define("fui-input", Input);
