import { Navigate } from "react-router-dom";
import { useMainStore } from "../../store/store";
import Cookies from "js-cookie";

function PrivateRoute({ children }) {
  const token = Cookies.get("token");
  const user = useMainStore((state) => state.user);
  return token ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
