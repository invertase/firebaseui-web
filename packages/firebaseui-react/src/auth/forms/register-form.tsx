"use client";

import { useForm } from "@tanstack/react-form";
import {
  FirebaseUIError,
  fuiCreateUserWithEmailAndPassword,
  type EmailFormSchema,
  getTranslation,
  createEmailFormSchema,
} from "@firebase-ui/core";
import { useAuth, useConfig, useTranslations } from "~/hooks";
import { useMemo, useState } from "react";
import { Button } from "../../components/button";
import { FieldInfo } from "../../components/field-info";

export function RegisterForm({
  onBackToSignInClick,
}: {
  onBackToSignInClick?: () => void;
}) {
  const auth = useAuth();
  const { language, enableAutoUpgradeAnonymous } = useConfig();
  const translations = useTranslations();
  const [formError, setFormError] = useState<string | null>(null);
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
        await fuiCreateUserWithEmailAndPassword(
          auth,
          value.email,
          value.password,
          {
            translations,
            language,
            enableAutoUpgradeAnonymous,
          }
        );
      } catch (error) {
        if (error instanceof FirebaseUIError) {
          setFormError(error.message);
          return;
        }

        console.error(error);
        setFormError(
          getTranslation("errors", "unknownError", translations, language)
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
                    language
                  )}
                </span>
                <input
                  aria-invalid={field.state.meta.errors.length > 0}
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
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
                  {getTranslation("labels", "password", translations, language)}
                </span>
                <input
                  aria-invalid={field.state.meta.errors.length > 0}
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </label>
            </>
          )}
        />
      </fieldset>

      <fieldset>
        <Button type="submit">
          {getTranslation("labels", "createAccount", translations, language)}
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
            {getTranslation("prompts", "haveAccount", translations, language)}{" "}
            {getTranslation("labels", "signIn", translations, language)} &rarr;
          </button>
        </div>
      )}
    </form>
  );
}
