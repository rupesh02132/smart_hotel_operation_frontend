import { Routes, Route} from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import HostLayout from "../Dashboard/host/HostLayout";

const HostRouter = () => {
  return (
    <ProtectedRoute allowedRoles={["host"]}>
      <Routes>
        <Route path="/*" element={<HostLayout />}>
    </Route>
      </Routes>
    </ProtectedRoute>
  );
};

export default HostRouter;
