import install from "@twind/with-web-components";
import { ContextConsumer } from "@lit/context";
import { css, LitElement } from "lit";
import { FirebaseUIContext } from "../context";

import config from "../../twind.config";

// Install twind.
const withTwind = install(config);

export class BaseElement extends withTwind(LitElement) {
  static styles = [css`
      :host {
        --theme-primary: var(--primary, 120 100% 25%);
        --theme-radius: var(--radius, 1rem);
      }
    `]

  context: FirebaseUIContext = {} as FirebaseUIContext;

  cn(...classNames: string[]) {
    const attributes = this.attributes.getNamedItem("class");

    if (attributes) {
      return `${attributes.value} ${classNames.join(" ")}`;
    }

    return classNames.join(" ");
  }

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
