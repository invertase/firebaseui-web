"use client";

import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import { useAuth, useConfig, useTranslations } from "~/hooks";
import {
  FirebaseUIError,
  getTranslation,
  createPhoneFormSchema,
  fuiSignInWithPhoneNumber,
  fuiConfirmPhoneNumber,
  CountryData,
  countryData,
  formatPhoneNumberWithCountry,
} from "@firebase-ui/core";
import { Button } from "../../components/button";
import { FieldInfo } from "../../components/field-info";
import { TermsAndPrivacy } from "../../components/terms-and-privacy";
import { CountrySelector } from "../../components/country-selector";
import { z } from "zod";

interface PhoneNumberFormProps {
  onSubmit: (phoneNumber: string) => Promise<void>;
  formError: string | null;
  recaptchaVerifier: RecaptchaVerifier | null;
  recaptchaContainerRef: React.RefObject<HTMLDivElement | null>;
  showTerms?: boolean;
}

function PhoneNumberForm({
  onSubmit,
  formError,
  recaptchaVerifier,
  recaptchaContainerRef,
  showTerms,
}: PhoneNumberFormProps) {
  const { language } = useConfig();
  const translations = useTranslations();
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(
    countryData[0]
  );

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
      const formattedNumber = formatPhoneNumberWithCountry(
        value.phoneNumber,
        selectedCountry.dialCode
      );
      await onSubmit(formattedNumber);
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
                <div className="fui-phone-input">
                  <CountrySelector
                    value={selectedCountry}
                    onChange={setSelectedCountry}
                    className="fui-phone-input__country-selector"
                  />
                  <input
                    aria-invalid={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                    id={field.name}
                    name={field.name}
                    type="tel"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="fui-phone-input__number-input"
                  />
                </div>
                <FieldInfo field={field} />
              </label>
            </>
          )}
        />
      </fieldset>

      <fieldset>
        <div className="fui-recaptcha-container" ref={recaptchaContainerRef} />
      </fieldset>

      {showTerms && <TermsAndPrivacy />}

      <fieldset>
        <Button type="submit" disabled={!recaptchaVerifier}>
          {getTranslation("labels", "sendCode", translations, language)}
        </Button>
        {formError && <div className="fui-form__error">{formError}</div>}
      </fieldset>
    </form>
  );
}

function useResendTimer(initialDelay: number) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [initialDelay]);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeLeft(initialDelay);
    setIsActive(true);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev <= 1 ? 0 : prev - 1;
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setIsActive(false);
        }
        return next;
      });
    }, 1000);
  }, [initialDelay]);

  const canResend = !isActive && timeLeft === 0;

  return { timeLeft, canResend, startTimer };
}

interface VerificationFormProps {
  onSubmit: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  formError: string | null;
  showTerms?: boolean;
  isResending: boolean;
  canResend: boolean;
  timeLeft: number;
  recaptchaContainerRef: React.RefObject<HTMLDivElement | null>;
}

function VerificationForm({
  onSubmit,
  onResend,
  formError,
  showTerms,
  isResending,
  canResend,
  timeLeft,
  recaptchaContainerRef,
}: VerificationFormProps) {
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
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
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
        <div className="fui-recaptcha-container" ref={recaptchaContainerRef} />
      </fieldset>

      {showTerms && <TermsAndPrivacy />}

      <fieldset>
        <Button type="submit">
          {getTranslation("labels", "verifyCode", translations, language)}
        </Button>
        <Button
          type="button"
          onClick={onResend}
          disabled={isResending || !canResend}
          variant="secondary"
        >
          {isResending
            ? getTranslation("labels", "sending", translations, language)
            : !canResend
            ? `${getTranslation(
                "labels",
                "resendCode",
                translations,
                language
              )} (${timeLeft}s)`
            : getTranslation("labels", "resendCode", translations, language)}
        </Button>
        {formError && <div className="fui-form__error">{formError}</div>}
      </fieldset>
    </form>
  );
}

export interface PhoneFormProps {
  resendDelay?: number;
}

export function PhoneForm({ resendDelay = 30 }: PhoneFormProps) {
  const auth = useAuth();
  const {
    language,
    recaptchaMode,
    enableAutoUpgradeAnonymous,
    enableHandleExistingCredential,
  } = useConfig();
  const translations = useTranslations();
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const { timeLeft, canResend, startTimer } = useResendTimer(resendDelay);

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
      setRecaptchaVerifier(null);
    };
  }, [auth, recaptchaMode]);

  const handlePhoneSubmit = async (number: string) => {
    setFormError(null);
    try {
      if (!recaptchaVerifier) {
        throw new Error("ReCAPTCHA not initialized");
      }

      const result = await fuiSignInWithPhoneNumber(
        auth,
        number,
        recaptchaVerifier,
        {
          translations,
          language,
        }
      );
      setPhoneNumber(number);
      setConfirmationResult(result);
      startTimer();
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

  const handleResend = async () => {
    if (
      isResending ||
      !canResend ||
      !phoneNumber ||
      !recaptchaContainerRef.current
    ) {
      return;
    }

    setIsResending(true);
    setFormError(null);

    try {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }

      const verifier = new RecaptchaVerifier(
        auth,
        recaptchaContainerRef.current,
        {
          size: recaptchaMode ?? "normal",
        }
      );
      setRecaptchaVerifier(verifier);

      const result = await fuiSignInWithPhoneNumber(
        auth,
        phoneNumber,
        verifier,
        {
          translations,
          language,
        }
      );
      setConfirmationResult(result);
      startTimer();
    } catch (error) {
      if (error instanceof FirebaseUIError) {
        setFormError(error.message);
      } else {
        console.error(error);
        setFormError(
          getTranslation("errors", "unknownError", translations, language)
        );
      }
    } finally {
      setIsResending(false);
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
        enableAutoUpgradeAnonymous,
        enableHandleExistingCredential,
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

  return (
    <div className="fui-form-container">
      {confirmationResult ? (
        <VerificationForm
          onSubmit={handleVerificationSubmit}
          onResend={handleResend}
          formError={formError}
          showTerms={false}
          isResending={isResending}
          canResend={canResend}
          timeLeft={timeLeft}
          recaptchaContainerRef={recaptchaContainerRef}
        />
      ) : (
        <PhoneNumberForm
          onSubmit={handlePhoneSubmit}
          formError={formError}
          recaptchaVerifier={recaptchaVerifier}
          recaptchaContainerRef={recaptchaContainerRef}
          showTerms
        />
      )}
    </div>
  );
}
