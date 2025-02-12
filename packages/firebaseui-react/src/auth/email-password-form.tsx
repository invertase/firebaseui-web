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
import { Button } from "../components/button";
import { FieldInfo } from "../components/field-info";
import { cn } from "~/utils/cn";

export function EmailPasswordForm({
  onForgotPasswordClick,
  onRegisterClick,
}: {
  onForgotPasswordClick?: () => void;
  onRegisterClick?: () => void;
}) {
  const auth = useAuth();
  const translations = useTranslations();
  const { language, enableAutoUpgradeAnonymous } = useConfig();
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
        await fuiSignInWithEmailAndPassword(auth, value.email, value.password, {
          translations,
          language,
          enableAutoUpgradeAnonymous,
        });
      } catch (error) {
        if (error instanceof FirebaseUIError) {
          setFormError(error.message);
        }
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label className="fui-form__label" htmlFor={field.name}>
                  {getTranslation("labels", "password", translations, language)}
                </label>
                {onForgotPasswordClick && (
                  <button
                    type="button"
                    onClick={onForgotPasswordClick}
                    className="fui-link"
                    style={{ fontSize: "14px" }}
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
          className="fui-form__error"
          style={{ textAlign: "center", marginTop: "var(--fui-spacing-sm)" }}
        >
          {formError}
        </div>
      )}

      {onRegisterClick && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "var(--fui-spacing-sm)",
            fontSize: "14px",
          }}
        >
          {getTranslation("prompts", "noAccount", translations, language)}{" "}
          <button
            type="button"
            onClick={onRegisterClick}
            className="fui-link"
            style={{ marginLeft: "4px" }}
          >
            {getTranslation("labels", "register", translations, language)}
          </button>
        </div>
      )}
    </form>
  );
}
