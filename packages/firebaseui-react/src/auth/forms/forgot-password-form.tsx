"use client";

import {
  createForgotPasswordFormSchema,
  FirebaseUIError,
  getTranslation,
  sendPasswordResetEmail,
  type ForgotPasswordFormSchema,
} from "@firebase-ui/core";
import { useForm } from "@tanstack/react-form";
import { useMemo, useState } from "react";
import { useUI } from "~/hooks";
import { Button } from "../../components/button";
import { FieldInfo } from "../../components/field-info";
import { TermsAndPrivacy } from "../../components/terms-and-privacy";

interface ForgotPasswordFormProps {
  onBackToSignInClick?: () => void;
}

export function ForgotPasswordForm({
  onBackToSignInClick,
}: ForgotPasswordFormProps) {
  const ui = useUI();

  const [formError, setFormError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [firstValidationOccured, setFirstValidationOccured] = useState(false);
  const forgotPasswordFormSchema = useMemo(
    () => createForgotPasswordFormSchema(ui.translations),
    [ui.translations]
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
        await sendPasswordResetEmail(ui, value.email);
        setEmailSent(true);
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

  if (emailSent) {
    return (
      <div className="fui-form__success">
        {getTranslation(ui, "messages", "checkEmailForReset")}
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

      <TermsAndPrivacy />

      <fieldset>
        <Button type="submit">
          {getTranslation(ui, "labels", "resetPassword")}
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
            {getTranslation(ui, "labels", "backToSignIn")} &rarr;
          </button>
        </div>
      )}
    </form>
  );
}
