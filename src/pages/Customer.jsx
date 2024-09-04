import React from "react";
import Layout from "../components/Layout/Layout";
import { Header } from "../utils";
import ListingPage from "../components/Customer/ListingPage";

const Customer = () => {

  return (
    <Layout>
      <Header text={`Customer Orders`} />
      <ListingPage />
    </Layout>
  );
};

export default Customer;
