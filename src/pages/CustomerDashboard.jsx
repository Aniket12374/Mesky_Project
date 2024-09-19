import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import CustomerDashboard from "../components/Customer/CustomerDashboard";

const CustomerDashboardMain = () => {
  const navigate = useNavigate();

  // check this useffect after token added
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
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
      <CustomerDashboard />
    </Layout>
  );
};

export default CustomerDashboardMain;
