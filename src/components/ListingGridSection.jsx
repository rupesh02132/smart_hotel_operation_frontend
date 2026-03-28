import ListingCard from "./ListingCard";
import SkeletonCard from "./SkeletonCard";

const ListingGridSection = ({ listings, loading }) => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-6">

      <div
        className="
        grid
        grid-cols-1
        min-[420px]:grid-cols-2
        sm:grid-cols-2
        md:grid-cols-3
        xl:grid-cols-4
        gap-3
        sm:gap-5
        lg:gap-6
        "
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : listings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
              />
            ))}
      </div>

    </div>
  );
};

export default ListingGridSection;