import { TanStackFormController } from "@tanstack/lit-form";
import { BaseElement } from "~/components/base";
import { property } from "lit/decorators.js";

type LoginForm = {
  email: string;
  // password: string;
};

export abstract class LoginFormController extends BaseElement {
  @property({ type: Boolean }) loading = false;

  form = new TanStackFormController<LoginForm>(this, {
    defaultValues: {
      email: "",
      // password: "",
    },
    onSubmit: ({ value }) => {
      console.log(value);
      this.loading = true;
    },
  });

  render() {
    throw new Error("Method not implemented.");
  }
}
