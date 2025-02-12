import type { FieldApi } from "@tanstack/react-form";
import { cn } from "~/utils/cn";

interface FieldInfoProps<TData> {
  field: FieldApi<TData, any>;
  className?: string;
}

export function FieldInfo<TData>({ field, className }: FieldInfoProps<TData>) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <div className={cn("fui-form__error", className)}>
          {field.state.meta.errors.join(", ")}
        </div>
      ) : null}
    </>
  );
}
