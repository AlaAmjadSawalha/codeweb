interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="max-w-xl w-full rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-muted-foreground">
          {description || "This page is ready as a placeholder route and can be implemented next."}
        </p>
      </div>
    </div>
  );
}
