export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 w-40 bg-slate-200 rounded animate-pulse" />
      <div className="h-28 w-full bg-slate-200 rounded-xl animate-pulse" />
      <div className="h-28 w-full bg-slate-200 rounded-xl animate-pulse" />
      <div className="h-28 w-full bg-slate-200 rounded-xl animate-pulse" />
    </div>
  );
}