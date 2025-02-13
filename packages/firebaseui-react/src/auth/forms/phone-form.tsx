"use client";

import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState, useMemo } from "react";
import { RecaptchaVerifier } from "firebase/auth";
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
import { cn } from "~/utils/cn";

export function PhoneForm() {
  const auth = useAuth();
  const translations = useTranslations();
  const { language, enableAutoUpgradeAnonymous } = useConfig();
  const [confirmationResult, setConfirmationResult] = useState<any>();
  const [formError, setFormError] = useState<string | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier>();

  const phoneFormSchema = useMemo(
    () =>
      createPhoneFormSchema(translations).pick({
        phoneNumber: true,
        recaptchaVerifier: true,
      }),
    [translations]
  );

  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    defaultValues: {
      phoneNumber: "",
      recaptchaVerifier: undefined as unknown as RecaptchaVerifier,
    },
    validators: {
      onBlur: phoneFormSchema,
      onSubmit: phoneFormSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      try {
        const result = await fuiSignInWithPhoneNumber(
          auth,
          value.phoneNumber,
          value.recaptchaVerifier,
          {
            translations,
            language,
          }
        );
        setConfirmationResult(result);
      } catch (error) {
        if (error instanceof FirebaseUIError) {
          setFormError(error.message);
        }
      }
    },
  });

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
      setFormError(null);
      try {
        if (!confirmationResult) return;
        await fuiConfirmPhoneNumber(
          confirmationResult,
          value.verificationCode,
          {
            translations,
            language,
            enableAutoUpgradeAnonymous,
          }
        );
      } catch (error) {
        if (error instanceof FirebaseUIError) {
          setFormError(error.message);
        }
      }
    },
  });

  useEffect(() => {
    if (!recaptchaContainerRef.current) return;

    const verifier = new RecaptchaVerifier(
      auth,
      recaptchaContainerRef.current,
      {
        size: "normal",
      }
    );

    setRecaptchaVerifier(verifier);
    phoneForm.setFieldValue("recaptchaVerifier", verifier);

    return () => {
      verifier.clear();
    };
  }, [auth, phoneForm]);

  if (!confirmationResult) {
    return (
      <form
        className="fui-form"
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await phoneForm.handleSubmit();
        }}
      >
        <div className="fui-form__group">
          <phoneForm.Field
            name="phoneNumber"
            children={(field) => (
              <>
                <label className="fui-form__label" htmlFor={field.name}>
                  {getTranslation(
                    "labels",
                    "phoneNumber",
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
                  type="tel"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>

        <div ref={recaptchaContainerRef} className="mb-4" />

        <div className="flex flex-col gap-2">
          <Button type="submit" variant="primary" disabled={!recaptchaVerifier}>
            {getTranslation("labels", "sendCode", translations, language)}
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

  return (
    <form
      className="fui-form"
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await verificationForm.handleSubmit();
      }}
    >
      <div className="fui-form__group">
        <verificationForm.Field
          name="verificationCode"
          children={(field) => (
            <>
              <label className="fui-form__label" htmlFor={field.name}>
                {getTranslation(
                  "labels",
                  "verificationCode",
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
                type="text"
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
          {getTranslation("labels", "verifyCode", translations, language)}
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
