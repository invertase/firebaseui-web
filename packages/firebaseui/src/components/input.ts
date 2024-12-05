import { css, html } from "lit";
import { spreadAttributes } from "~/utils";
import { BaseElement } from "./base";

export class Input extends BaseElement {
  static styles = [
    ...super.styles,
    css`
      input {
        border-radius: var(--theme-radius);
        border: 1px solid hsl(var(--theme-primary));
      }
    `,
  ];

  _sendEvent(e: Event, type: string) {
    const target = e.target as HTMLInputElement;
    this.dispatchEvent(
      new CustomEvent(`on-${type}`, {
        detail: { value: target.value },
        bubbles: true,
        composed: true,
      })
    );

    this.requestUpdate();
  }

  render() {
    return html`
      <input
        ...="${spreadAttributes(this.attributes)}" 
        @input="${(e: Event) => this._sendEvent(e, "input")}"
        @blur="${(e: Event) => this._sendEvent(e, "blur")}"
        @focus="${(e: Event) => this._sendEvent(e, "focus")}"
      ></input>
    `;
  }
}

customElements.define("fui-input", Input);
