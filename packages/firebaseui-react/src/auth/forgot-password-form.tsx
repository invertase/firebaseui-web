"use client";

import { useForm } from "@tanstack/react-form";
import {
  FirebaseUIError,
  fuiSendPasswordResetEmail,
  type ForgotPasswordFormSchema,
  getTranslation,
  createForgotPasswordFormSchema,
} from "@firebase-ui/core";
import { useAuth, useTranslations } from "~/hooks";
import { useMemo, useState } from "react";
import { Button } from "../components/button";
import { FieldInfo } from "../components/field-info";

export function ForgotPasswordForm() {
  const auth = useAuth();
  const translations = useTranslations();
  const [formError, setFormError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const forgotPasswordFormSchema = useMemo(
    () => createForgotPasswordFormSchema(translations),
    [translations]
  );

  const form = useForm<ForgotPasswordFormSchema>({
    defaultValues: {
      email: "",
    },
    validators: {
      onBlur: forgotPasswordFormSchema,
      onSubmit: forgotPasswordFormSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      try {
        await fuiSendPasswordResetEmail(auth, value.email, { translations });
        setEmailSent(true);
      } catch (error) {
        if (error instanceof FirebaseUIError) {
          setFormError(error.message);
        }
      }
    },
  });

  if (emailSent) {
    return (
      <div className="fui-form__success">
        {getTranslation("messages", "checkEmailForReset", translations)}
      </div>
    );
  }

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
                {getTranslation("labels", "emailAddress", translations)}
              </label>
              <input
                className={`fui-form__input ${
                  field.state.meta.errors.length ? "fui-form__input--error" : ""
                }`}
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

      <Button type="submit" variant="primary">
        {getTranslation("labels", "resetPassword", translations)}
      </Button>

      {formError && (
        <div
          className="fui-form__error"
          style={{ textAlign: "center", marginTop: "var(--fui-spacing-sm)" }}
        >
          {formError}
        </div>
      )}
    </form>
  );
}
