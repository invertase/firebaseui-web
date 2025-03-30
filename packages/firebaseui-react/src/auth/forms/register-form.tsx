"use client";

import {
  FirebaseUIError,
  createEmailFormSchema,
  createUserWithEmailAndPassword,
  type EmailFormSchema,
} from "@firebase-ui/core";
import { getTranslation } from "@firebase-ui/translations";
import { useForm } from "@tanstack/react-form";
import { useMemo, useState } from "react";
import { useDefaultLocale, useTranslations, useUI } from "~/hooks";
import { Button } from "../../components/button";
import { FieldInfo } from "../../components/field-info";
import { TermsAndPrivacy } from "../../components/terms-and-privacy";

export function RegisterForm({
  onBackToSignInClick,
}: {
  onBackToSignInClick?: () => void;
}) {
  const ui = useUI();
  const translations = useTranslations(ui);
  const defaultLocale = useDefaultLocale(ui);

  const [formError, setFormError] = useState<string | null>(null);
  const [firstValidationOccured, setFirstValidationOccured] = useState(false);
  const emailFormSchema = useMemo(
    () => createEmailFormSchema(translations),
    [translations]
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
        setFormError(
          getTranslation("errors", "unknownError", translations, defaultLocale)
        );
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
                <span>
                  {getTranslation(
                    "labels",
                    "emailAddress",
                    translations,
                    defaultLocale
                  )}
                </span>
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
                <span>
                  {getTranslation(
                    "labels",
                    "password",
                    translations,
                    defaultLocale
                  )}
                </span>
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

      <TermsAndPrivacy />

      <fieldset>
        <Button type="submit">
          {getTranslation(
            "labels",
            "createAccount",
            translations,
            defaultLocale
          )}
        </Button>
        {formError && <div className="fui-form__error">{formError}</div>}
      </fieldset>

      {onBackToSignInClick && (
        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={onBackToSignInClick}
            className="fui-form__action"
          >
            {getTranslation(
              "prompts",
              "haveAccount",
              translations,
              defaultLocale
            )}{" "}
            {getTranslation("labels", "signIn", translations, defaultLocale)}{" "}
            &rarr;
          </button>
        </div>
      )}
    </form>
  );
}
