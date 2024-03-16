import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardTab from "../components/Dashboard";
import Layout from "../components/Layout/Layout";
import { useMainStore } from "../store/store";
import { Header } from "../utils";
import Cookies from "js-cookie";

const Dashboard = () => {
  const user = useMainStore((state) => state.user);
  const navigate = useNavigate();

  // check this useffect after token added
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      console.log('check');
      return navigate("/login");
    }
  }, [navigate]);

  return (
    <Layout>
      <Header text={`Hi ${user.name}!`} />
      <DashboardTab />
    </Layout>
  );
};

export default Dashboard;
