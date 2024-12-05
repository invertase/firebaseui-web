import { LitElement, html } from "lit";
import { provide } from "@lit/context";
import { property } from "lit/decorators.js";
import { FirebaseUIContext } from "../context";

export class Provider extends LitElement {

  // Ensures that the provider doesn't scope into the Shadow DOM, since
  // it's just a top-level context provider.
  createRenderRoot() {
    return this;
  }

  @provide({ context: FirebaseUIContext })
  @property({ type: FirebaseUIContext })
  context = undefined as unknown as FirebaseUIContext;
}

window.customElements.define("fui-provider", Provider);