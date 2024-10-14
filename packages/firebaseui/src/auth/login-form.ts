import { html } from "lit";

import { LoginFormController } from "./login-form-controller";

import "~/components/input";
import "~/components/button";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import '~/components/button';

export class LoginForm extends LoginFormController {
  render() {
    return html`
      <form
        @submit=${(e: Event) => {
          e.preventDefault();
          this.form.api.handleSubmit();
        }}
      >
        <div>
          <label for="email">Email Address:</label>
          ${this.form.field(
            {
              name: "email",
              validatorAdapter: zodValidator(),
              validators: { onChange: z.string().email() },
            },
            (field) => {
              return html`<input
              is="fui-input"
              type="email"
              placeholder="Email Address"
              .value="${field.state.value}"
              @blur="${() => field.handleBlur()}"
              @input="${(e: Event) => {
                const target = e.target as HTMLInputElement;
                field.handleChange(target.value);
              }}"
            ></-input>
            ${field.state.meta.errors.map((e) => html`<div>${e}</div>`)}
            `;
            }
          )}
        </div>
        </div>
        <div slot="submit">
          <fui-button type="submit" ?disabled="${this.loading}" data-foo="bar">
            ${this.loading ? "Loading..." : "Login"}
          </fui-button>
        </div>
      </form>
    `;
  }
}

customElements.define("fui-login-form", LoginForm);
