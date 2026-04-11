import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import ManagerLayout from "../Dashboard/manager/ManagerLayout";
import ManagerDashboard from "../Dashboard/manager/ManagerDashboard";
import AnalyticsDashboard from "../Admin/component/AnalyticsDashboard";
const ManagerRouter = () => {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <Routes>
        <Route path="/" element={<ManagerLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
};

export default ManagerRouter;
