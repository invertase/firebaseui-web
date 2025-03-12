"use client";

import { useForm } from "@tanstack/react-form";
import {
  FirebaseUIError,
  fuiSignInWithEmailAndPassword,
  type EmailFormSchema,
  getTranslation,
  createEmailFormSchema,
} from "@firebase-ui/core";
import { useAuth, useConfig, useTranslations } from "~/hooks";
import { useMemo, useState } from "react";
import { Button } from "../../components/button";
import { FieldInfo } from "../../components/field-info";
import { TermsAndPrivacy } from "../../components/terms-and-privacy";

interface EmailPasswordFormProps {
  onForgotPasswordClick?: () => void;
  onRegisterClick?: () => void;
}

export function EmailPasswordForm({
  onForgotPasswordClick,
  onRegisterClick,
}: EmailPasswordFormProps) {
  const auth = useAuth();
  const translations = useTranslations();
  const {
    language,
    enableAutoUpgradeAnonymous,
    enableHandleExistingCredential,
  } = useConfig();
  const [formError, setFormError] = useState<string | null>(null);
  const [firstValidationOccured, setFirstValidationOccured] = useState(false);

  // TODO: Do we need to memoize this?
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
        await fuiSignInWithEmailAndPassword(auth, value.email, value.password, {
          translations,
          language,
          enableAutoUpgradeAnonymous,
          enableHandleExistingCredential,
        });
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
                <span className="inline-flex flex">
                  <span className="flex-grow">
                    {getTranslation(
                      "labels",
                      "password",
                      translations,
                      language
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={onForgotPasswordClick}
                    className="fui-form__action"
                  >
                    {getTranslation(
                      "labels",
                      "forgotPassword",
                      translations,
                      language
                    )}
                  </button>
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
          {getTranslation("labels", "signIn", translations, language)}
        </Button>
        {formError && <div className="fui-form__error">{formError}</div>}
      </fieldset>

      {onRegisterClick && (
        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={onRegisterClick}
            className="fui-form__action"
          >
            {getTranslation("prompts", "noAccount", translations, language)}{" "}
            {getTranslation("labels", "register", translations, language)}
          </button>
        </div>
      )}
    </form>
  );
}
