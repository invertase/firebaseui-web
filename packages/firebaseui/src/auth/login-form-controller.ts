import { TanStackFormController } from "@tanstack/lit-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { BaseElement } from "~/components/base";

type LoginForm = {
  __root__: string;
  email: string;
  password: string;
};

export class LoginFormController extends BaseElement {
  constructor() {
    super();
  }

  form = new TanStackFormController<LoginForm>(this, {
    defaultValues: {
      __root__: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        return await signInWithEmailAndPassword(
          this.context.auth,
          value.email,
          value.password
        );
      } catch (e) {
        formApi.setErrorMap({});
      }
    },
    onSubmitInvalid(props) {
      console.log("invalid", props);
    },
  });

  render() {
    throw new Error("Method not implemented.");
  }
}
