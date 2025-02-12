import type { FieldApi } from "@tanstack/react-form";

interface FieldInfoProps<TData> {
  field: FieldApi<TData, any>;
  className?: string;
}

export function FieldInfo<TData>({ field, className }: FieldInfoProps<TData>) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <div className={`fui-form__error ${className || ""}`}>
          {field.state.meta.errors.join(", ")}
        </div>
      ) : null}
    </>
  );
}
