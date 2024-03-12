import ListingPage from "../components/Subscription/ListingPage";
import Layout from "../components/Layout/Layout";
import { Header } from "../utils";
import dayjs from "dayjs";

const Subscription = () => {
  const currentDate = dayjs();
  const formattedDate = currentDate.add(1, "day").format("MMMM DD, YYYY");
  return (
    <Layout>
      <Header text={`Orders For ${formattedDate}`} />
      <ListingPage />
    </Layout>
  );
};

export default Subscription;
