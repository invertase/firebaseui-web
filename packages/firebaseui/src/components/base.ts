import { ContextConsumer } from "@lit/context";
import { css, LitElement, unsafeCSS } from "lit";
import { FirebaseUIContext } from "../context";

import normalize from "normalize.css?inline";

export class BaseElement extends LitElement {
  context: FirebaseUIContext = {} as FirebaseUIContext;

  static styles = [
    unsafeCSS(normalize),
    css`
      :host {
        --theme-radius: var(--radius, 1rem);
        --theme-primary: hsl(var(--primary, 34 100% 50%) / .4);
      }
    `,
  ];

  constructor() {
    super();
    new ContextConsumer(this, {
      context: FirebaseUIContext,
      callback: (value) => {
        this.context = value;
      },
      subscribe: true,
    });
  }
}
