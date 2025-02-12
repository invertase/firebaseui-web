import { HTMLAttributes } from "react";
import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";
import { cn } from "~/utils/cn";

interface CardSubtitleProps extends HTMLAttributes<HTMLParagraphElement> {
  text?: string;
}

export function CardSubtitle({
  text,
  className = "",
  ...props
}: CardSubtitleProps) {
  const { language } = useConfig();
  const translations = useTranslations();

  const subtitleText =
    text ||
    getTranslation("prompts", "signInToAccount", translations, language);

  return (
    <p className={cn("fui-card__subtitle", className)} {...props}>
      {subtitleText}
    </p>
  );
}
