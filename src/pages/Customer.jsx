import React from "react";

import Layout from "../components/Layout/Layout";
import { Header } from "../utils";
import dayjs from "dayjs";
import ListingPage from "../components/Customer/ListingPage";

const Subscription = () => {
  const currentDate = dayjs();
  let formattedDate;

  if (currentDate.hour() < 12) {
    formattedDate = currentDate.format("MMMM DD, YYYY");
  } else {
    formattedDate = currentDate.add(1, "day").format("MMMM DD, YYYY");
  }

  return (
    <Layout>
      <Header text={`Customer Orders`} />
      <ListingPage />
    </Layout>
  );
};

export default Subscription;
