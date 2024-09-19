import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

// import Campaign from "./pages/Campaign";
import Login from "./pages/Login";
import History from "./pages/History";
import Agents from "./pages/Agent/Agents";
import Subscription from "./pages/Subscription";
import PrivateRoute from "./components/Auth/PrivateRoute";
import AreaMapping from "./pages/AreaMapping";
import Routing from "./pages/Routing";
import Dashboard from "./pages/Dashboard";
import CustomerDashboardMain from "./pages/CustomerDashboard";
import { getCookie } from "./services/cookiesFunc";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");

    script.setAttribute(
      "src",
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places"
    );
    head.appendChild(script);

    return () => {
      head.removeChild(script);
    };
  }, []);

  const isCustomerAgent = getCookie("customerAgent") == "true";

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <div className='relative'>
          <Routes>
            {isCustomerAgent ? (
              <Route
                path='/customer-support'
                element={
                  <PrivateRoute>
                    <CustomerDashboardMain />
                  </PrivateRoute>
                }
              />
            ) : (
              <>
                <Route
                  path='/dashboard'
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/subscription'
                  element={
                    <PrivateRoute>
                      <Subscription />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/routing'
                  element={
                    <PrivateRoute>
                      <Routing />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/history'
                  element={
                    <PrivateRoute>
                      <History />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/agents'
                  element={
                    <PrivateRoute>
                      <Agents />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/AreaMapping'
                  element={
                    <PrivateRoute>
                      <AreaMapping />
                    </PrivateRoute>
                  }
                />
              </>
            )}
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Navigate to='/login' />} />
          </Routes>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
