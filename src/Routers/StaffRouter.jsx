import { Routes, Route } from "react-router-dom";
import StaffLayout from "../Dashboard/staff/StaffLayout";

const StaffRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<StaffLayout />} />
    </Routes>
  );
};

export default StaffRouter;
