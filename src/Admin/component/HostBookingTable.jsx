import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "@mui/material";
import { getHostBookings } from "../../state/booking/Action";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

import {
  CalendarMonth as CalendarIcon,
  CurrencyRupee as RupeeIcon,
  Email as EmailIcon,
  Receipt as TokenIcon,
  CheckCircle as PaidIcon,
  Pending as PendingIcon,
  Hotel as HotelIcon,
} from "@mui/icons-material";

const HostBookingTable = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:768px)");

  const { loading, error, allBookings } = useSelector(
    (store) => store.bookings || {}
  );

  useEffect(() => {
    dispatch(getHostBookings());
  }, [dispatch]);

  // Statistics
  const stats = useMemo(() => {
    const total = allBookings?.length || 0;
    const paid = allBookings?.filter(b => b.isPaid).length || 0;
    const pending = total - paid;
    const totalRevenue = allBookings?.reduce((sum, b) => sum + (b.totalPrice || 0), 0) || 0;
    return { total, paid, pending, totalRevenue };
  }, [allBookings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Message variant="danger">{error}</Message>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
            <span className="text-indigo-600 text-xs font-semibold uppercase tracking-wider">Bookings Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Host Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all bookings across your properties</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-3 sm:p-4 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div><p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.total}</p><p className="text-xs text-gray-500">Total Bookings</p></div>
              <HotelIcon className="text-blue-500 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-3 sm:p-4 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div><p className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.paid}</p><p className="text-xs text-gray-500">Paid</p></div>
              <PaidIcon className="text-emerald-500 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/5 rounded-xl p-3 sm:p-4 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <div><p className="text-2xl sm:text-3xl font-bold text-amber-600">{stats.pending}</p><p className="text-xs text-gray-500">Pending</p></div>
              <PendingIcon className="text-amber-500 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-3 sm:p-4 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div><p className="text-2xl sm:text-3xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</p><p className="text-xs text-gray-500">Total Revenue</p></div>
              <RupeeIcon className="text-purple-500 text-2xl opacity-70" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        {allBookings?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <HotelIcon className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No bookings found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {!isMobile ? (
              /* Desktop Table View */
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                    <tr className="uppercase tracking-wider text-xs sm:text-sm">
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Token</th>
                      <th className="px-4 py-3 text-left">Dates</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allBookings.map((booking, idx) => (
                      <tr key={booking._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <EmailIcon className="text-gray-400 text-sm" />
                            <span className="text-gray-700 break-all">{booking.user?.email || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {booking.isPaid ? (
                            <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-xs font-mono">
                              <TokenIcon className="text-gray-500 text-sm" />
                              #{booking._id.slice(0, 7)}
                            </span>
                          ) : (
                            <span className="text-red-500 font-medium flex items-center gap-1">
                              <PendingIcon className="text-sm" /> Not Paid
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-gray-600">
                            <CalendarIcon className="text-indigo-400 text-sm" />
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800">
                          <div className="flex items-center gap-1">
                            <RupeeIcon className="text-green-600 text-sm" />
                            {booking.totalPrice}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {booking.isPaid ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                              <PaidIcon className="text-sm" /> Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                              <PendingIcon className="text-sm" /> Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Mobile Card View */
              <div className="p-4 space-y-4">
                {allBookings.map((booking) => (
                  <div key={booking._id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <EmailIcon className="text-gray-400 text-sm" />
                          <span className="text-sm font-medium text-gray-700 break-all">{booking.user?.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <TokenIcon className="text-gray-400 text-sm" />
                          <span className="font-mono">#{booking._id.slice(0, 10)}...</span>
                        </div>
                      </div>
                      {booking.isPaid ? (
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
                          <PaidIcon className="text-sm" /> Paid
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold flex items-center gap-1">
                          <PendingIcon className="text-sm" /> Pending
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarIcon className="text-indigo-400 text-sm" />
                        <span>{new Date(booking.checkIn).toLocaleDateString()} → {new Date(booking.checkOut).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-gray-800">
                        <RupeeIcon className="text-green-600 text-sm" />
                        <span>₹{booking.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Stats */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 text-sm text-gray-500 flex justify-between">
              <span>Showing {allBookings.length} bookings</span>
              <span>Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostBookingTable;