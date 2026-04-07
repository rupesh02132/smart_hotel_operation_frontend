import { useEffect } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getHostBookings } from "../../state/booking/Action";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const HostBookingTable = () => {
  const dispatch = useDispatch();

  const { loading, error, allBookings } = useSelector(
    (store) => store.bookings || {}
  );

  useEffect(() => {
    dispatch(getHostBookings());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-6 px-2 sm:px-6">
      
      {/* Container */}
      <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200">
        
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 tracking-tight">
          Host Bookings
        </h2>

        {/* States */}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : allBookings?.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No bookings found.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            
            <Table
              hover
              responsive
              className="min-w-[700px] text-sm align-middle mb-0"
            >
              {/* Header */}
              <thead className="bg-gray-900 text-white sticky top-0 z-10">
                <tr className="text-xs sm:text-sm uppercase tracking-wider">
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {allBookings.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className={`transition duration-200 ${
                      index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    } hover:bg-blue-50`}
                  >
                    {/* Email */}
                    <td className="px-4 py-3 font-medium text-gray-700 break-all max-w-[180px]">
                      {booking.user?.email || "N/A"}
                    </td>

                    {/* Token */}
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {booking.isPaid ? (
                        <span className="bg-gray-200 px-2 py-1 rounded-md text-xs">
                          #{booking._id.slice(0, 7)}
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          Not Paid
                        </span>
                      )}
                    </td>

                    {/* Dates */}
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      ₹{booking.totalPrice}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      {booking.isPaid ? (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                          Paid
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostBookingTable;