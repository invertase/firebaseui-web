import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";

interface CardTitleProps {
  text?: string;
  className?: string;
}

export function CardTitle({ text, className }: CardTitleProps) {
  const { language } = useConfig();
  const translations = useTranslations();

  const titleText =
    text || getTranslation("labels", "signIn", translations, language);

  return <h2 className={`fui-card__title ${className || ""}`}>{titleText}</h2>;
}
