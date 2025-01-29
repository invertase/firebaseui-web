import type { FieldApi } from "@tanstack/react-form";

export function FieldInfo<TData>({ field }: { field: FieldApi<TData, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <div className="fui-form__error">
          {field.state.meta.errors.join(", ")}
        </div>
      ) : null}
    </>
  );
}
