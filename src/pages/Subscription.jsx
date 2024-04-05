import React from "react";
import ListingPage from "../components/Subscription/ListingPage";
import Layout from "../components/Layout/Layout";
import { Header } from "../utils";
import dayjs from "dayjs";
import { useState } from "react";

const Subscription = () => {
  const [totalCount, setTotalCount] = useState(0);
  const currentDate = dayjs();
  let formattedDate;

  if (currentDate.hour() < 12) {
    formattedDate = currentDate.format("MMMM DD, YYYY");
  } else {
    formattedDate = currentDate.add(1, "day").format("MMMM DD, YYYY");
  }

  return (
    <Layout>
      <Header
        text={`Orders For ${formattedDate}`}
        count={`TotalCount ${totalCount}`}
      />
      <ListingPage setTotalCount={setTotalCount} />
    </Layout>
  );
};

export default Subscription;
