import { Routes, Route } from "react-router-dom";

import CustomerRouters from "./Routers/CustomerRouters";
import AdminRouter from "./Routers/AdminRouter";
import HostRouter from "./Routers/HostRouter";
import StaffRouter from "./Routers/StaffRouter";
import ManagerRouter from "./Routers/ManagerRouter";

import { GoogleOAuthProvider } from "@react-oauth/google";

// MUI Date Picker Fix
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex flex-col min-h-screen bg-gray-50">

          <main className="flex-grow">
 <Routes>
      {/* User */}
      <Route path="/*" element={<CustomerRouters />} />

      {/* Admin */}
      <Route path="/admin/*" element={<AdminRouter />} />

      {/* Host */}
      <Route path="/host/*" element={<HostRouter />} />

      {/* Staff */}
      <Route path="/staff/*" element={<StaffRouter />} />

      {/* Manager */}
      <Route path="/manager/*" element={<ManagerRouter />} />
    </Routes>
          </main>

        </div>
      </LocalizationProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
