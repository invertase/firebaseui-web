"use client";

import { useForm } from "@tanstack/react-form";
import { useAuth, useConfig, useTranslations } from "~/hooks";
import {
  FirebaseUIError,
  getTranslation,
  createEmailLinkFormSchema,
  fuiSendSignInLinkToEmail,
  fuiCompleteEmailLinkSignIn,
} from "@firebase-ui/core";
import { Button } from "../../components/button";
import { FieldInfo } from "../../components/field-info";
import { useEffect, useState, useMemo } from "react";
import { TermsAndPrivacy } from "../../components/terms-and-privacy";

export function EmailLinkForm() {
  const auth = useAuth();
  const {
    language,
    enableAutoUpgradeAnonymous,
    enableHandleExistingCredential,
  } = useConfig();
  const translations = useTranslations();
  const [formError, setFormError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [firstValidationOccured, setFirstValidationOccured] = useState(false);

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
          return;
        }

        console.error(error);
        setFormError(
          getTranslation("errors", "unknownError", translations, language)
        );
      }
    },
  });

  // Handle email link sign-in if URL contains the link
  useEffect(() => {
    const completeSignIn = async () => {
      try {
        await fuiCompleteEmailLinkSignIn(auth, window.location.href, {
          translations,
          language,
          enableAutoUpgradeAnonymous,
          enableHandleExistingCredential,
        });
      } catch (error) {
        if (error instanceof FirebaseUIError) {
          setFormError(error.message);
        }
      }
    };

    void completeSignIn();
  }, [
    auth,
    translations,
    language,
    enableAutoUpgradeAnonymous,
    enableHandleExistingCredential,
  ]);

  if (emailSent) {
    // TODO: Improve this UI
    return (
      <div>
        {getTranslation("messages", "signInLinkSent", translations, language)}
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
          {getTranslation("labels", "sendSignInLink", translations, language)}
        </Button>
        {formError && <div className="fui-form__error">{formError}</div>}
      </fieldset>
    </form>
  );
}
