import ListingPage from "../components/Subscription/ListingPage";
import Layout from "../components/Layout/Layout";
import { Header } from "../utils";

const Subscription = () => {
  return (
    <Layout>
      <Header text="Orders For February 15, 2024" />
      <ListingPage />
    </Layout>
  );
};

export default Subscription;
