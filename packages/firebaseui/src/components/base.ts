import { ContextConsumer } from "@lit/context";
import { css, LitElement, unsafeCSS } from "lit";
import { FirebaseUIContext } from "../context";

import preflight from "~/preflight.css?inline";

export class BaseElement extends LitElement {
  static styles = [
    unsafeCSS(preflight),
    css`
      :host {
        --theme-primary: var(--primary, 34 100% 50%);
        --theme-primary-foreground: var(--primary-foreground, 0 0% 100%);
        --theme-radius: var(--radius, 1rem);
      }
    `,
  ];

  context: FirebaseUIContext = {} as FirebaseUIContext;

  constructor() {
    super();
    new ContextConsumer(this, {
      context: FirebaseUIContext,
      callback: (value) => {
        console.log('CONTEXT', value);
        this.context = value;
      },
      subscribe: true,
    });
  }
}
