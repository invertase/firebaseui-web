import type { FieldApi } from "@tanstack/react-form";
import { HTMLAttributes } from "react";
import { cn } from "~/utils/cn";

interface FieldInfoProps<TData> extends HTMLAttributes<HTMLDivElement> {
  field: FieldApi<TData, any>;
}

export function FieldInfo<TData>({
  field,
  className,
  ...props
}: FieldInfoProps<TData>) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <div role="alert" aria-live="polite" className={cn("fui-form__error", className)} {...props}>
          {field.state.meta.errors.join(", ")}
        </div>
      ) : null}
    </>
  );
}
