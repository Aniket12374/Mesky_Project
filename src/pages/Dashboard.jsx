import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useMainStore } from "../store/store";
import { Header } from "../utils";
import Cookies from "js-cookie";
import DashboardDetail from "../components/Dashboard/DashboardDetail";
import dayjs from "dayjs";
import CustomerDashboard from "../components/Customer/CustomerDashboard";

const Dashboard = () => {
  const user = useMainStore((state) => state.user);
  const navigate = useNavigate();

  // check this useffect after token added
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      console.log("check");
      return navigate("/login");
    }
  }, [navigate]);

  const currentDate = dayjs();
  let formattedDate;

  if (currentDate.hour() < 12) {
    formattedDate = currentDate.format("MMMM DD, YYYY");
  } else {
    formattedDate = currentDate.add(1, "day").format("MMMM DD, YYYY");
  }

  return (
    <Layout>
      <Header text={`Dashboard - ${formattedDate}`} />
      {/* <DashboardDetail /> */}
      <CustomerDashboard />
    </Layout>
  );
};

export default Dashboard;
