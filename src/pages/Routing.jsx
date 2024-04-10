import Layout from "../components/Layout/Layout";
import ListingPage from "../components/Routing/ListingPage";
import { Header } from "../utils";

const Routing = () => {
  return (
    <Layout>
      <Header text="Routing" />
      <ListingPage />
    </Layout>
  );
};

export default Routing;
