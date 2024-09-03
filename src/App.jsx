import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

// import Campaign from "./pages/Campaign";
import Login from "./pages/Login";
import History from "./pages/History";
import Agents from "./pages/Agent/Agents";
import Subscription from "./pages/Subscription";
import Customer from "./pages/Customer";
import PrivateRoute from "./components/Auth/PrivateRoute";
import AreaMapping from "./pages/AreaMapping";
import Routing from "./pages/Routing";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route index path="/" element={<Navigate to="/login" />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/subscription"
            element={
              <PrivateRoute>
                <Subscription />
              </PrivateRoute>
            }
          />

          <Route
            path="/customer"
            element={
              <PrivateRoute>
                <Customer />
              </PrivateRoute>
            }
          />

          <Route
            path="/routing"
            element={
              <PrivateRoute>
                <Routing />
              </PrivateRoute>
            }
          />

          <Route
            path="/history"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <PrivateRoute>
                <Agents />
              </PrivateRoute>
            }
          />

          <Route
            path="/AreaMapping"
            element={
              <PrivateRoute>
                <AreaMapping />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
