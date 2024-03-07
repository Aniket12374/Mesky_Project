// import React from 'react'
import ListingPage from "../components/History/ListingPage";
import Layout from "../components/Layout/Layout";
// import ListingPage from "../components/";
import { Header } from "../utils";

const History = () => {
  return (
    <Layout>
      <Header text="Order History" />
      <ListingPage />
    </Layout>
  );
};

export default History;
