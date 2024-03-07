import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

// import Campaign from "./pages/Campaign";
import Demo from "./pages/Demo";
import Login from "./pages/Login";
import History from "./pages/History";
import Agents from "./pages/Agent/Agents";
import Subscription from "./pages/Subscription";
import PrivateRoute from "./components/Auth/PrivateRoute";
// import Dashboard from "./pages/Dashboard";
// import Inventory from "./pages/Inventory";
// import Order from "./pages/Order";
// import Profile from "./pages/Profile";

// import Product from "./pages/Product/Product";
// import ProductCreation from "./pages/Product/ProductCreation";

// import Post from "./pages/Post/Post";
// import CreatePost from "./pages/Post/CreatePost";
// import EditPost from "./pages/Post/EditPost";

// import Support from "./pages/Support";
// import Warehouse from "./pages/Warehouse";

// import DetailView from "./components/Orders/DetailView";

// import AgentCreation from "./pages/Agent/AgentCreation";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route index path="/" element={<Navigate to="/login" />} />
          <Route path="/demo" element={<Demo />} />
          {/* <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/subscription"
            element={
              <PrivateRoute>
                <Subscription />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/campaigns"
            element={
              <PrivateRoute>
                <Campaign />
              </PrivateRoute>
            }
          /> */}
          {/* <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Order />
              </PrivateRoute>
            }
          />
          <Route
            path="/:tab/order/view/:orderId"
            element={
              <PrivateRoute>
                <DetailView />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <Inventory />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <PrivateRoute>
                <Post />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts/create"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts/edit/:id"
            element={
              <PrivateRoute>
                <EditPost />
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <Product />
              </PrivateRoute>
            }
          />
          <Route
            index
            path="/products/edit/:productId"
            element={
              <PrivateRoute>
                <ProductCreation createFlow={false} />
              </PrivateRoute>
            }
          />
          <Route
            index
            path="/products/create"
            exact
            element={
              <PrivateRoute>
                <ProductCreation createFlow={true} />
              </PrivateRoute>
            }
          /> */}
          {/* <Route
            index
            path="/Agent/create"
            exact
            element={
              <PrivateRoute>
                <AgentCreation createFlow={true} />
              </PrivateRoute>
            }
          /> */}
          {/* <Route
            path="/support"
            element={
              <PrivateRoute>
                <Support />
              </PrivateRoute>
            }
          />
          <Route
            path="/warehouses"
            element={
              <PrivateRoute>
                <Warehouse />
              </PrivateRoute>
            }
          /> */}
          {/* <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          /> */}
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
          <Route path="/login" element={<Login />} />
        </Routes>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
