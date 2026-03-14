import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllListings } from "../state/listing/Action";
import Map from "../components/Map";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useParams, useNavigate } from "react-router-dom";
import { FaHome, FaMapMarkedAlt } from "react-icons/fa";

const MapScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: cityId } = useParams();

  const { loading, error, listing } = useSelector(
    (state) => state.listings
  );

  const listings = listing?.listings || [];

  useEffect(() => {
    dispatch(getAllListings(cityId));
  }, [cityId, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex items-center gap-3">
            <FaMapMarkedAlt className="text-green-600 text-xl" />

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {cityId
                ? `Hotels in ${decodeURIComponent(cityId)}`
                : "Explore Hotels on Map"}
            </h1>

            {cityId && (
              <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                {listings.length} Results
              </span>
            )}
          </div>

          {/* Back Button */}

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            <FaHome />
            Back to Hotels
          </button>
        </div>
      </div>

      {/* CONTENT */}

      <div className="max-w-7xl mx-auto px-4 py-6">

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>

            {/* MAP CARD */}

            <div className="bg-white rounded-xl shadow-md overflow-hidden border">

              <div className="p-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-700">
                  Map View
                </h2>
                <p className="text-sm text-gray-500">
                  Click on a hotel marker to see rooms and book
                </p>
              </div>

              <Map listings={listings} />

            </div>

            {/* FOOTER INFO */}

            <div className="mt-6 text-center text-gray-600 text-sm">
              Showing <span className="font-semibold">{listings.length}</span>{" "}
              hotels on the map
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default MapScreen;