export function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-7 lg:px-10" aria-label="Chargement">
      <div className="mb-6 h-5 w-48 animate-pulse rounded bg-emerald-100" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-28 animate-pulse rounded-2xl border border-emerald-100 bg-white" />
        ))}
      </div>
    </main>
  );
}
