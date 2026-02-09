import Skeleton from "../ui/Skeleton";

export default function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <Skeleton width="200px" height={32} className="mb-4" />
          <Skeleton variant="text" lines={2} />
        </div>

        {/* Content skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg border border-slate-200"
            >
              <Skeleton
                variant="circular"
                width={48}
                height={48}
                className="mb-4"
              />
              <Skeleton variant="text" lines={3} />
              <Skeleton width="60%" className="mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
