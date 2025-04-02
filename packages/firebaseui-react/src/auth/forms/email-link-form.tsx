"use client";

import {
  FirebaseUIError,
  completeEmailLinkSignIn,
  createEmailLinkFormSchema,
  getTranslation,
  sendSignInLinkToEmail,
} from "@firebase-ui/core";
import { useForm } from "@tanstack/react-form";
import { useEffect, useMemo, useState } from "react";
import { useAuth, useUI } from "~/hooks";
import { Button } from "../../components/button";
import { FieldInfo } from "../../components/field-info";
import { TermsAndPrivacy } from "../../components/terms-and-privacy";

export function EmailLinkForm() {
  const ui = useUI();
  const auth = useAuth(ui);

  const [formError, setFormError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [firstValidationOccured, setFirstValidationOccured] = useState(false);

  const emailLinkFormSchema = useMemo(
    () => createEmailLinkFormSchema(ui.translations),
    [ui.translations]
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
        await sendSignInLinkToEmail(ui, value.email);
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

  // Handle email link sign-in if URL contains the link
  useEffect(() => {
    const completeSignIn = async () => {
      try {
        await completeEmailLinkSignIn(ui, window.location.href);
      } catch (error) {
        if (error instanceof FirebaseUIError) {
          setFormError(error.message);
        }
      }
    };

    void completeSignIn();
  }, [auth, ui.translations]);

  if (emailSent) {
    // TODO: Improve this UI
    return <div>{getTranslation(ui, "messages", "signInLinkSent")}</div>;
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
          {getTranslation(ui, "labels", "sendSignInLink")}
        </Button>
        {formError && <div className="fui-form__error">{formError}</div>}
      </fieldset>
    </form>
  );
}
