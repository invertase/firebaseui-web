"use client";

import {
  FirebaseUIError,
  createEmailFormSchema,
  createUserWithEmailAndPassword,
  getTranslation,
  type EmailFormSchema,
} from "@firebase-ui/core";
import { useForm } from "@tanstack/react-form";
import { useMemo, useState } from "react";
import { useUI } from "~/hooks";
import { Button } from "../../components/button";
import { FieldInfo } from "../../components/field-info";
import { Policies } from "../../components/policies";

export interface RegisterFormProps {
  onBackToSignInClick?: () => void;
}

export function RegisterForm({ onBackToSignInClick }: RegisterFormProps) {
  const ui = useUI();

  const [formError, setFormError] = useState<string | null>(null);
  const [firstValidationOccured, setFirstValidationOccured] = useState(false);
  const emailFormSchema = useMemo(
    () => createEmailFormSchema(ui.translations),
    [ui.translations]
  );

  const form = useForm<EmailFormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onBlur: emailFormSchema,
      onSubmit: emailFormSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      try {
        await createUserWithEmailAndPassword(ui, value.email, value.password);
      } catch (error) {
        if (error instanceof FirebaseUIError) {
          setFormError(error.message);
          return;
        }

        console.error(error);
        setFormError(getTranslation(ui, "errors", "unknownError"));
      }
    },
  });

  return (
    <form
      className="fui-form"
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
      }}
    >
      <fieldset>
        <form.Field
          name="email"
          children={(field) => (
            <>
              <label htmlFor={field.name}>
                <span>{getTranslation(ui, "labels", "emailAddress")}</span>
                <input
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={() => {
                    setFirstValidationOccured(true);
                    field.handleBlur();
                  }}
                  onInput={(e) => {
                    field.handleChange((e.target as HTMLInputElement).value);
                    if (firstValidationOccured) {
                      field.handleBlur();
                      form.update();
                    }
                  }}
                />
                <FieldInfo field={field} />
              </label>
            </>
          )}
        />
      </fieldset>

      <fieldset>
        <form.Field
          name="password"
          children={(field) => (
            <>
              <label htmlFor={field.name}>
                <span>{getTranslation(ui, "labels", "password")}</span>
                <input
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={() => {
                    setFirstValidationOccured(true);
                    field.handleBlur();
                  }}
                  onInput={(e) => {
                    field.handleChange((e.target as HTMLInputElement).value);
                    if (firstValidationOccured) {
                      field.handleBlur();
                      form.update();
                    }
                  }}
                />
                <FieldInfo field={field} />
              </label>
            </>
          )}
        />
      </fieldset>

      <Policies />

      <fieldset>
        <Button type="submit" disabled={ui.state !== "idle"}>
          {getTranslation(ui, "labels", "createAccount")}
        </Button>
        {formError && <div className="fui-form__error">{formError}</div>}
      </fieldset>

      {onBackToSignInClick && (
        <div className="flex justify-center items-center">
          <button
            type="button"
            disabled={ui.state !== "idle"}
            onClick={onBackToSignInClick}
            className="fui-form__action"
          >
            {getTranslation(ui, "prompts", "haveAccount")}{" "}
            {getTranslation(ui, "labels", "signIn")} &rarr;
          </button>
        </div>
      )}
    </form>
  );
}
