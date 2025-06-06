/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use client";

import {
  createEmailFormSchema,
  FirebaseUIError,
  getTranslation,
  signInWithEmailAndPassword,
  type EmailFormSchema,
} from "@firebase-ui/core";
import { useForm } from "@tanstack/react-form";
import { useMemo, useState } from "react";
import { useUI } from "~/hooks";
import { Button } from "../../components/button";
import { FieldInfo } from "../../components/field-info";
import { Policies } from "../../components/policies";

export interface EmailPasswordFormProps  {
  onForgotPasswordClick?: () => void;
  onRegisterClick?: () => void;
}

export function EmailPasswordForm({
  onForgotPasswordClick,
  onRegisterClick,
}: EmailPasswordFormProps) {
  const ui = useUI();

  const [formError, setFormError] = useState<string | null>(null);
  const [firstValidationOccured, setFirstValidationOccured] = useState(false);

  // TODO: Do we need to memoize this?
  const emailFormSchema = useMemo(
    () => createEmailFormSchema(ui.translations),
    [ui.translations]
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
        await signInWithEmailAndPassword(ui, value.email, value.password);
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

      <fieldset>
        <form.Field
          name="password"
          children={(field) => (
            <>
              <label htmlFor={field.name}>
                <span className="flex">
                  <span className="flex-grow">
                    {getTranslation(ui, "labels", "password")}
                  </span>
                  <button
                    type="button"
                    disabled={ui.state !== "idle" ? true : false}
                    onClick={onForgotPasswordClick}
                    className="fui-form__action"
                  >
                    {getTranslation(ui, "labels", "forgotPassword")}
                  </button>
                </span>
                <input
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  id={field.name}
                  name={field.name}
                  type="password"
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

      <Policies />

      <fieldset>
        <Button type="submit" disabled={ui.state !== "idle" ? true : false}>
          {getTranslation(ui, "labels", "signIn")}
        </Button>
        {formError && <div className="fui-form__error">{formError}</div>}
      </fieldset>

      {onRegisterClick && (
        <div className="flex justify-center items-center">
          <button
            type="button"
            disabled={ui.state !== "idle" ? true : false}
            onClick={onRegisterClick}
            className="fui-form__action"
          >
            {getTranslation(ui, "prompts", "noAccount")}{" "}
            {getTranslation(ui, "labels", "register")}
          </button>
        </div>
      )}
    </form>
  );
}
