"use client"

import { FieldApi, useForm } from '@tanstack/react-form'
import { emailFormSchema, FirebaseUIError, fuiSignInWithEmailAndPassword, type EmailFormSchema } from '@firebase-ui/core';
import { Button } from '~/components/button';

export function SignInForm() {
  
  const form = useForm<EmailFormSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      // auth would be from context/store
      try {
        await fuiSignInWithEmailAndPassword({} as any, value.email, value.password, {
          translations: {},
          // blahsbs: false,
        });
      } catch (error) {
        if (error instanceof FirebaseUIError) {
          console.log(error.message); // translated message
        }

        // setError something went wrong
        throw error;
      }
      
      // Do something with form data
      console.log(value)
    },
    // Add a validator to support Zod usage in Form and Field (no longer needed with zod@3.24.0 or higher)
    validators: {
      onChange: emailFormSchema,
    },
  })
  return (
    <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div>
          {/* A type-safe field component*/}
          <form.Field
            name="email"
            validators={{
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
            }}
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
              )
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

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(',')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}
