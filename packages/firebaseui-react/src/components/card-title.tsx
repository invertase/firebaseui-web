import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";
import { cn } from "~/utils/cn";

interface CardTitleProps {
  text?: string;
  className?: string;
}

export function CardTitle({ text, className }: CardTitleProps) {
  const { language } = useConfig();
  const translations = useTranslations();

  const titleText =
    text || getTranslation("labels", "signIn", translations, language);

  return <h2 className={cn("fui-card__title", className)}>{titleText}</h2>;
}
