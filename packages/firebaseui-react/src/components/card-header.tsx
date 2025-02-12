import { useConfig, useTranslations } from "~/hooks";
import { getTranslation } from "@firebase-ui/core";
import type { TranslationStrings } from "@firebase-ui/core";

type LabelKeys = keyof Required<TranslationStrings>["labels"];
type PromptKeys = keyof Required<TranslationStrings>["prompts"];

interface CardHeaderProps {
  titleKey: LabelKeys;
  subtitleKey: PromptKeys;
}

export function CardHeader({ titleKey, subtitleKey }: CardHeaderProps) {
  const { language } = useConfig();
  const translations = useTranslations();

  return (
    <div className="fui-card__header">
      <h2 className="fui-card__title">
        {getTranslation("labels", titleKey, translations, language)}
      </h2>
      <p className="fui-card__subtitle">
        {getTranslation("prompts", subtitleKey, translations, language)}
      </p>
    </div>
  );
}
