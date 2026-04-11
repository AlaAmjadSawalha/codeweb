interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] d-flex align-items-center justify-content-center p-4">
      <div className="max-w-xl w-100 rounded-4 border border-border bg-white p-5 text-center shadow-sm">
        <h1 className="fs-2 fw-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-muted">
          {description || "This page is ready as a placeholder route and can be implemented next."}
        </p>
      </div>
    </div>
  );
}
