import { Navigate } from "react-router-dom";
import { useMainStore } from "../../store/store";

function PrivateRoute({ children }) {
  const user = useMainStore((state) => state.user);
  return user.token ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
