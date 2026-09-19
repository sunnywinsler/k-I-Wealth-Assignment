export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-line w-60" />
      <div className="skeleton-line w-40" />
      <div className="skeleton-line w-80" />
      <div className="skeleton-row">
        <div className="skeleton-pill" />
        <div className="skeleton-pill" />
      </div>
    </div>
  );
}
