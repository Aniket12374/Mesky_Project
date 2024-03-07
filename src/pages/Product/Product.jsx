import Layout from "../../components/Layout/Layout";
import Button from "../../components/Common/Button";
import ListingPage from "../../components/Product/ListingPage";
import { useNavigate } from "react-router-dom";
import { Header } from "../../utils";

const Product = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex justify-between">
        <Header text="Products" />
        <div className="float-right">
          <Button
            btnName={"+ Add Products"}
            onClick={() => navigate("/products/create")}
          />
          {/* <Button btnName={"+ Upload Bulk"} /> */}
        </div>
      </div>

      <ListingPage />
    </Layout>
  );
};

export default Product;
