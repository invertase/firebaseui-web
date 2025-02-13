"use client";

import { useForm } from "@tanstack/react-form";
import { useAuth, useConfig, useTranslations } from "~/hooks";
import {
  FirebaseUIError,
  getTranslation,
  createEmailLinkFormSchema,
  fuiSendSignInLinkToEmail,
  fuiSignInWithEmailLink,
  fuiIsSignInWithEmailLink,
} from "@firebase-ui/core";
import { Button } from "../../components/button";
import { FieldInfo } from "../../components/field-info";
import { useEffect, useState, useMemo } from "react";

export function EmailLinkForm() {
  const auth = useAuth();
  const { language, enableAutoUpgradeAnonymous } = useConfig();
  const translations = useTranslations();
  const [formError, setFormError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const emailLinkFormSchema = useMemo(
    () => createEmailLinkFormSchema(translations),
    [translations]
  );

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onBlur: emailLinkFormSchema,
      onSubmit: emailLinkFormSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      try {
        await fuiSendSignInLinkToEmail(auth, value.email, {
          translations,
          language,
          enableAutoUpgradeAnonymous,
        });
        setEmailSent(true);
      } catch (error) {
        if (error instanceof FirebaseUIError) {
          setFormError(error.message);
        }
      }
    },
  });

  // Handle email link sign-in if URL contains the link
  useEffect(() => {
    const completeSignIn = async () => {
      try {
        const email = window.localStorage.getItem("emailForSignIn");
        if (!email) return;

        if (fuiIsSignInWithEmailLink(auth, window.location.href)) {
          await fuiSignInWithEmailLink(auth, email, window.location.href, {
            translations,
            language,
            enableAutoUpgradeAnonymous,
          });
          window.localStorage.removeItem("emailForSignIn");
        }
      } catch (error) {
        if (error instanceof FirebaseUIError) {
          setFormError(error.message);
        }
      }
    };

    void completeSignIn();
  }, [auth, translations]);

  if (emailSent) {
    return (
      <div className="fui-form">
        <div className="text-center mb-4">
          {getTranslation("messages", "signInLinkSent", translations, language)}
        </div>
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
                {getTranslation(
                  "labels",
                  "emailAddress",
                  translations,
                  language
                )}
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

      <div className="flex flex-col gap-2">
        <Button type="submit" variant="primary">
          {getTranslation("labels", "sendSignInLink", translations, language)}
        </Button>
      </div>

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
