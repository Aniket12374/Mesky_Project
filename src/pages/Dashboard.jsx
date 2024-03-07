import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardTab from "../components/Dashboard";
import Layout from "../components/Layout/Layout";
import { useMainStore } from "../store/store";
import { Header } from "../utils";

const Dashboard = () => {
  const user = useMainStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.onLine || !user.token) {
      return navigate("/login");
    }
  }, [user]);

  return (
    <Layout>
      <Header text={`Hi ${user.name}!`} />
      <DashboardTab />
    </Layout>
  );
};

export default Dashboard;
