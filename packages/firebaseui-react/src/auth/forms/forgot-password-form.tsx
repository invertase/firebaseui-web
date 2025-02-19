"use client";

import { useForm } from "@tanstack/react-form";
import {
  FirebaseUIError,
  fuiSendPasswordResetEmail,
  type ForgotPasswordFormSchema,
  getTranslation,
  createForgotPasswordFormSchema,
} from "@firebase-ui/core";
import { useAuth, useConfig, useTranslations } from "~/hooks";
import { useMemo, useState } from "react";
import { Button } from "../../components/button";
import { FieldInfo } from "../../components/field-info";
import { TermsAndPrivacy } from "../../components/terms-and-privacy";

interface ForgotPasswordFormProps {
  onBackToSignInClick?: () => void;
}

export function ForgotPasswordForm({
  onBackToSignInClick,
}: ForgotPasswordFormProps) {
  const auth = useAuth();
  const translations = useTranslations();
  const { language } = useConfig();
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
        await fuiSendPasswordResetEmail(auth, value.email, {
          translations,
          language,
        });
        setEmailSent(true);
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

  if (emailSent) {
    return (
      <div className="fui-form__success">
        {getTranslation(
          "messages",
          "checkEmailForReset",
          translations,
          language
        )}
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

      <TermsAndPrivacy />

      <fieldset>
        <Button type="submit">
          {getTranslation("labels", "resetPassword", translations, language)}
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
            {getTranslation("labels", "backToSignIn", translations, language)}{" "}
            &rarr;
          </button>
        </div>
      )}
    </form>
  );
}
