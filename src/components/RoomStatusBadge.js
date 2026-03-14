const RoomStatusBadge = ({ status }) => {
  const map = {
    Booked: "bg-blue-500/20 text-blue-300",
    CheckedIn: "bg-emerald-500/20 text-emerald-300",
    Cleaning: "bg-yellow-500/20 text-yellow-300",
    CheckedOut: "bg-orange-500/20 text-orange-300",
    Completed: "bg-gray-500/20 text-gray-300",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border border-white/10 ${
        map[status] || "bg-white/10"
      }`}
    >
      {status}
    </span>
  );
};

export default RoomStatusBadge;
