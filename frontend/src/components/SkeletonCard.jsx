// frontend/src/components/SkeletonCard.jsx
export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image */}
      <div className="h-48 bg-gray-200" />

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Nom */}
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        {/* Description — 2 lignes */}
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        {/* Prix + badge */}
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-5 bg-gray-200 rounded w-1/4" />
        </div>
        {/* Bouton */}
        <div className="h-9 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
