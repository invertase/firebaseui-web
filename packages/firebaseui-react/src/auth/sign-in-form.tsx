"use client";

import { FieldApi, useForm } from "@tanstack/react-form";
import { type EmailFormSchema } from "@firebase-ui/core";
import { useContext } from "react";
import { ConfigContext } from "../context";

export function SignInForm() {
  const form = useForm<EmailFormSchema>({
    defaultValues: {
      email: "",
      password: "",
      authMode: "signIn",
    },
    // onSubmit: async ({ value }) => {
    // auth would be from context/store
    // try {
    //   await fuiSignInWithEmailAndPassword(
    //     {} as any,
    //     value.email,
    //     value.password,
    //     {
    //       translations: {},
    //       // blahsbs: false,
    //     }
    //   );
    // } catch (error) {
    //   if (error instanceof FirebaseUIError) {
    //     console.log(error.message); // translated message
    //   }
    //   // setError something went wrong
    //   throw error;
    // },

    // Do something with form data
    // console.log(value);
    // },
  });

  const config = useContext(ConfigContext);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div>
        {config.translations?.en?.errors?.invalidEmail}
        {/* A type-safe field component*/}
        <form.Field
          name="email"
          validators={
            {
              // onChange: z
              //   .string()
              //   .min(3, '[Field] First name must be at least 3 characters'),
              // onChangeAsyncDebounceMs: 500,
              // onChangeAsync: z.string().refine(
              //   async (value) => {
              //     await new Promise((resolve) => setTimeout(resolve, 1000))
              //     return !value.includes('error')
              //   },
              //   {
              //     message: "[Field] No 'error' allowed in first name",
              //   },
              // ),
            }
          }
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <>
                <label htmlFor={field.name}>First Name:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            );
          }}
        />
      </div>
      <div>
        <form.Field
          name="password"
          children={(field) => (
            <>
              <label htmlFor={field.name}>Last Name:</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          )}
        />
      </div>
    </form>
  );
}

function FieldInfo<T extends keyof EmailFormSchema>({
  field,
}: {
  field: FieldApi<EmailFormSchema, T, undefined, undefined>;
}) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(",")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}
