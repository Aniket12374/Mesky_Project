import { Header } from "../utils";
import AreaMap from "../components/AreaMapping/AreaMap";
import Layout from "../components/Layout/Layout";

const AreaMapping = () => {
  return (
    <Layout>
      <Header text="Area Mapping" />
      <AreaMap />
    </Layout>
  );
};

export default AreaMapping;
