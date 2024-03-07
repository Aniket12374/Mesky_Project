import React from "react";
import Layout from "../components/Layout/Layout";
import ListingPage from "../components/Orders/ListingTabs/ListingPage";
import { Header } from "../utils";

const Order = () => {
  return (
    <Layout>
      <Header text="Orders" />
      <ListingPage />
    </Layout>
  );
};

export default Order;
