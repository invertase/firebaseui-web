import { LitElement, html } from "lit";
import { provide } from "@lit/context";
import { customElement, property } from "lit/decorators.js";
import { FirebaseUIContext } from "../context";

@customElement("fui-provider")
export class FirebaseUIProvider extends LitElement {

  // Ensures that the provider doesn't scope into the Shadow DOM, since
  // it's just a top-level context provider.
  createRenderRoot() {
    return this;
  }

  @provide({ context: FirebaseUIContext })
  @property({ type: FirebaseUIContext })
  context = undefined as unknown as FirebaseUIContext;

  render() {
    return html`<slot />`;
  }
}
