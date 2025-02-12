import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";
import { cn } from "~/utils/cn";

interface CardSubtitleProps {
  text?: string;
  className?: string;
}

export function CardSubtitle({ text, className }: CardSubtitleProps) {
  const { language } = useConfig();
  const translations = useTranslations();

  const subtitleText =
    text ||
    getTranslation("prompts", "signInToAccount", translations, language);

  return <p className={cn("fui-card__subtitle", className)}>{subtitleText}</p>;
}
