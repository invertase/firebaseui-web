export class FirebaseUIInput extends HTMLInputElement {
  constructor() {
    super();
    this.className = "border border-theme";
  }
}

customElements.define("fui-input", FirebaseUIInput, { extends: "input" });

