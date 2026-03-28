import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllListings } from "../../state/listing/Action";
import ListingCard from "../../components/ListingCard";

const HostScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector((s) => s.auth?.user?.user?._id || "");
  console.log("user", userId);

  const listings1 = useSelector((store) => store.listings);
  const listings = listings1?.listing.listings || [];
  // const {listings} = useSelector((store) => store.listings);
  console.log("listings from host..", listings);
  // Fetch listings on mount
  useEffect(() => {
    dispatch(getAllListings({}));
  }, [dispatch]);

  const hostListings = listings?.filter((l) => {
    const id = typeof l.user === "string" ? l.user : l.user?._id;
    return id?.toString() === userId?.toString();
  });

  console.log("hostListings", hostListings);

  // Redirect to create page
  // const handleCreate = () => navigate("/host/listings/new");

  // Redirect to edit page
  const handleCardClick = (id) => {
    navigate(`/host/listings/${id}/edit`);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
    

      {/* Listings Grid */}
      {hostListings.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostListings.map((listing) => (
            <div
              key={listing._id}
              onClick={() => handleCardClick(listing._id)}
              className="bg-white border rounded-lg shadow-md hover:shadow-xl cursor-pointer transition p-2"
            >
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState loading={!listings.length} />
      )}
    </section>
  );
};

// EmptyState Component
const EmptyState = ({ loading }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-24 w-24 mb-6 ${
        loading ? "animate-pulse stroke-gray-400" : "stroke-gray-300"
      }`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13l3 3m0 0l3-3m-3 3V6m9 8l3 3m0 0l3-3m-3 3V6"
      />
    </svg>

    <h2 className="text-xl font-semibold">
      {loading ? "Loading listings…" : "No listings found for your account."}
    </h2>
    {!loading && (
      <p className="mt-2 text-sm text-gray-600 max-w-sm">
        Click{" "}
        <span className="text-blue-600 font-medium">
          {" "}
          <button>New Listing</button>
        </span>{" "}
        to add your first stay.
      </p>
    )}
  </div>
);

export default HostScreen;
