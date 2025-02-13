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
import { cn } from "~/utils/cn";

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
  const { language, enableAutoUpgradeAnonymous } = useConfig();
  const [formError, setFormError] = useState<string | null>(null);

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
        });
      } catch (error) {
        if (error instanceof FirebaseUIError) {
          setFormError(error.message);
          return;
        }

        console.error(error);
        // TODO: Translation for this
        setFormError("Something went wrong");
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
      <div className="fui-form__group">
        <form.Field
          name="email"
          children={(field) => (
            <>
              <label className="fui-form__label" htmlFor={field.name}>
                {getTranslation(
                  "labels",
                  "emailAddress",
                  translations,
                  language
                )}
              </label>
              <input
                className={cn(
                  "fui-form__input",
                  field.state.meta.errors.length && "fui-form__input--error"
                )}
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          )}
        />
      </div>

      <div className="fui-form__group">
        <form.Field
          name="password"
          children={(field) => (
            <>
              <div className="flex justify-between items-center">
                <label className="fui-form__label" htmlFor={field.name}>
                  {getTranslation("labels", "password", translations, language)}
                </label>
                {onForgotPasswordClick && (
                  <button
                    type="button"
                    onClick={onForgotPasswordClick}
                    className="fui-link text-sm"
                  >
                    {getTranslation(
                      "labels",
                      "forgotPassword",
                      translations,
                      language
                    )}
                  </button>
                )}
              </div>
              <input
                className={cn(
                  "fui-form__input",
                  field.state.meta.errors.length && "fui-form__input--error"
                )}
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          )}
        />
      </div>

      <Button type="submit" variant="primary">
        {getTranslation("labels", "signIn", translations, language)}
      </Button>

      {formError && (
        <div
          // TODO: Check class vs styles
          className="fui-form__error"
          style={{ textAlign: "center", marginTop: "var(--fui-spacing-sm)" }}
        >
          {formError}
        </div>
      )}

      {onRegisterClick && (
        <div
          className="flex justify-center items-center"
          style={{
            // TODO: Make this utility class
            marginTop: "var(--fui-spacing-sm)",
          }}
        >
          {getTranslation("prompts", "noAccount", translations, language)}{" "}
          <button
            type="button"
            onClick={onRegisterClick}
            className="fui-link"
            // TODO: Make this utility class - do we need it?
            style={{ marginLeft: "4px" }}
          >
            {getTranslation("labels", "register", translations, language)}
          </button>
        </div>
      )}
    </form>
  );
}
