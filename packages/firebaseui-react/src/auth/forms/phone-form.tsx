"use client";

import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState, useMemo } from "react";
import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import { useAuth, useConfig, useTranslations } from "~/hooks";
import {
  FirebaseUIError,
  getTranslation,
  createPhoneFormSchema,
  fuiSignInWithPhoneNumber,
  fuiConfirmPhoneNumber,
} from "@firebase-ui/core";
import { Button } from "../../components/button";
import { FieldInfo } from "../../components/field-info";
import { z } from "zod";

interface PhoneNumberFormProps {
  onSubmit: (phoneNumber: string) => Promise<void>;
  formError: string | null;
  recaptchaVerifier: RecaptchaVerifier | null;
  recaptchaContainerRef: React.RefObject<HTMLDivElement | null>;
}

function PhoneNumberForm({
  onSubmit,
  formError,
  recaptchaVerifier,
  recaptchaContainerRef,
}: PhoneNumberFormProps) {
  const { language } = useConfig();
  const translations = useTranslations();

  const phoneFormSchema = useMemo(
    () =>
      createPhoneFormSchema(translations).pick({
        phoneNumber: true,
      }),
    [translations]
  );

  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    defaultValues: {
      phoneNumber: "",
    },
    validators: {
      onBlur: phoneFormSchema,
      onSubmit: phoneFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value.phoneNumber);
    },
  });

  return (
    <form
      className="fui-form"
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await phoneForm.handleSubmit();
      }}
    >
      <fieldset>
        <phoneForm.Field
          name="phoneNumber"
          children={(field) => (
            <>
              <label htmlFor={field.name}>
                <span>
                  {getTranslation(
                    "labels",
                    "phoneNumber",
                    translations,
                    language
                  )}
                </span>
                <input
                  aria-invalid={field.state.meta.errors.length > 0}
                  id={field.name}
                  name={field.name}
                  type="tel"
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
        <div ref={recaptchaContainerRef} />
      </fieldset>

      <fieldset>
        <Button type="submit" disabled={!recaptchaVerifier}>
          {getTranslation("labels", "sendCode", translations, language)}
        </Button>
        {formError && <div className="fui-form__error">{formError}</div>}
      </fieldset>
    </form>
  );
}

interface VerificationFormProps {
  onSubmit: (code: string) => Promise<void>;
  formError: string | null;
}

function VerificationForm({ onSubmit, formError }: VerificationFormProps) {
  const { language } = useConfig();
  const translations = useTranslations();

  const verificationFormSchema = useMemo(
    () =>
      createPhoneFormSchema(translations).pick({
        verificationCode: true,
      }),
    [translations]
  );

  const verificationForm = useForm<z.infer<typeof verificationFormSchema>>({
    defaultValues: {
      verificationCode: "",
    },
    validators: {
      onBlur: verificationFormSchema,
      onSubmit: verificationFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value.verificationCode);
    },
  });

  return (
    <form
      className="fui-form"
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await verificationForm.handleSubmit();
      }}
    >
      <fieldset>
        <verificationForm.Field
          name="verificationCode"
          children={(field) => (
            <>
              <label htmlFor={field.name}>
                <span>
                  {getTranslation(
                    "labels",
                    "verificationCode",
                    translations,
                    language
                  )}
                </span>
                <input
                  aria-invalid={field.state.meta.errors.length > 0}
                  id={field.name}
                  name={field.name}
                  type="text"
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
          {getTranslation("labels", "verifyCode", translations, language)}
        </Button>
        {formError && <div className="fui-form__error">{formError}</div>}
      </fieldset>
    </form>
  );
}

export function PhoneForm() {
  const auth = useAuth();
  const { language, recaptchaMode } = useConfig();
  const translations = useTranslations();
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!recaptchaContainerRef.current) return;

    const verifier = new RecaptchaVerifier(
      auth,
      recaptchaContainerRef.current,
      {
        size: recaptchaMode ?? "normal",
      }
    );

    setRecaptchaVerifier(verifier);

    return () => {
      verifier.clear();
    };
  }, [auth, recaptchaMode]);

  const handlePhoneSubmit = async (phoneNumber: string) => {
    setFormError(null);
    try {
      if (!recaptchaVerifier) {
        throw new Error("ReCAPTCHA not initialized");
      }

      const result = await fuiSignInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier,
        {
          translations,
          language,
        }
      );
      setConfirmationResult(result);
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
  };

  const handleVerificationSubmit = async (code: string) => {
    if (!confirmationResult) {
      throw new Error("Confirmation result not initialized");
    }

    setFormError(null);

    try {
      await fuiConfirmPhoneNumber(confirmationResult, code, {
        translations,
        language,
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
  };

  if (confirmationResult) {
    return (
      <VerificationForm
        onSubmit={handleVerificationSubmit}
        formError={formError}
      />
    );
  }

  return (
    <PhoneNumberForm
      onSubmit={handlePhoneSubmit}
      formError={formError}
      recaptchaVerifier={recaptchaVerifier}
      recaptchaContainerRef={recaptchaContainerRef}
    />
  );
}
