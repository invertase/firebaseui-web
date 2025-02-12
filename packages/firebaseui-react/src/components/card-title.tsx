import { HTMLAttributes } from "react";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";
import { cn } from "~/utils/cn";

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  text?: string;
}

export function CardTitle({ text, className = "", ...props }: CardTitleProps) {
  const { language } = useConfig();
  const translations = useTranslations();

  const titleText =
    text || getTranslation("labels", "signIn", translations, language);

  return (
    <h2 className={cn("fui-card__title", className)} {...props}>
      {titleText}
    </h2>
  );
}
