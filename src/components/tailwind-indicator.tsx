export function TailwindIndicator() {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-1 left-1 z-50 d-flex h-6 w-6 align-items-center justify-content-center rounded-circle bg-gray-800 p-3 font-mono small text-white">
      <div className="d-block sm:hidden">xs</div>
      <div className="d-none sm:block d-md-none">sm</div>
      <div className="d-none d-md-block d-lg-none">md</div>
      <div className="d-none d-lg-block xl:hidden">lg</div>
      <div className="d-none xl:block 2xl:hidden">xl</div>
      <div className="d-none 2xl:block">2xl</div>
    </div>
  );
}
