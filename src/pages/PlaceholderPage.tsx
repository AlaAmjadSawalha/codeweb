import { useTranslation } from "react-i18next";

interface PlaceholderPageProps {
  titleKey: string;
  descriptionKey?: string;
}

export default function PlaceholderPage({ titleKey, descriptionKey }: PlaceholderPageProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="max-w-xl w-full rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">{t(titleKey)}</h1>
        <p className="mt-3 text-muted-foreground">
          {descriptionKey ? t(descriptionKey) : t("placeholder.defaultDescription")}
        </p>
      </div>
    </div>
  );
}
