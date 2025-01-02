import { html, nothing } from "lit";

import { LoginFormController } from "./login-form-controller";

import "~/components/input";
import "~/components/button";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import "~/components/button";
import "~/components/input";
import "~/components/fieldset";
import { BaseElement } from "~/components/base";
import { repeat } from "lit/directives/repeat.js";

export class LoginForm extends LoginFormController {
  static styles = [...BaseElement.styles];

  render() {
    return html`
      <form
        id="login-form"
        @submit=${async (e: Event) => {
          e.preventDefault();
          try {
            await this.form.api.handleSubmit();
          } catch (e) {
            console.log(e);
          }
        }}
      >
        <fieldset>
          <label
            for="email"
          >
            Email Address
          </label>
          ${this.form.field(
            {
              name: "email",
              validatorAdapter: zodValidator(),
              validators: { onChange: z.string().email() },
            },
            (field) => {
              return html`
                <fui-input
                  type="email"
                  placeholder="Email Address"
                  .value="${field.state.value}"
                  @on-blur="${() => field.handleBlur()}"
                  @on-input="${(e: CustomEvent) => {
                    field.handleChange(e.detail.value);
                  }}"
                ></fui-input>
                ${field.state.meta.errors.map(
                  (error) => html`<div>${error}</div>`
                )}
              `;
            }
          )}
        </fieldset>
        <fieldset>
          <label
            for="password"
            class="block mb-2 text-sm leading-none font-medium text-red-500"
          >
            Password
          </label>
          ${this.form.field(
            {
              name: "password",
              validatorAdapter: zodValidator(),
              validators: {
                onChange: z
                  .string()
                  .min(6, "Password must be at least 6 characters long."),
              },
            },
            (field) => {
              return html`
                <fui-input
                  type="password"
                  .value="${field.state.value}"
                  @on-blur="${() => field.handleBlur()}"
                  @on-input="${(e: CustomEvent) => {
                    field.handleChange(e.detail.value);
                  }}"
                ></fui-input>
                ${field.state.meta.isTouched && field.state.meta.errors.length
                  ? html`${repeat(
                      field.state.meta.errors,
                      (__, idx) => idx,
                      (error) => {
                        return html`<div class="container">${error}</div>`;
                      }
                    )}`
                  : nothing}
              `;
            }
          )}
        </fieldset>
        <button is="fui-button" type="submit">Login</-button>
      </form>
    `;
  }
}

customElements.define("fui-login-form", LoginForm);
