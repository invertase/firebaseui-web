import { css, html } from "lit";
import { spreadAttributes } from "~/utils";
import { BaseElement } from "./base";
import { property } from "lit/decorators.js";

export class Fieldset extends BaseElement {

  @property({ type: String })
  inputId = "";

  @property({ type: String })
  label = "";

  render() {
    return html`
      <fieldset
        ...="${spreadAttributes(this.attributes)}"
        class="${this.cn("")}"
      >
        ${this.label && html`<label for="${this.inputId}" class="block mb-2 text-sm leading-none font-medium">${this.label}</label>`}
        <slot></slot>
      </fieldset>
    `;
  }
}

customElements.define("fui-fieldset", Fieldset);
