import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import CreateProduct from "../../components/Product/CreateProduct";
import { useLocation } from "react-router-dom";
import { productDetail } from "../../services/product/productService";
import { LoaderIcon } from "react-hot-toast";

const ProductCreation = ({ createFlow }) => {
  const location = useLocation();
  const productId = location.pathname.split("/").pop();
  const [data, setData] = useState({});
  const [cancelBtnClicked, setCancelBtnClicked] = useState(false);

  useEffect(() => {
    if (!createFlow) {
      productDetail(Number(productId))
        .then((res) => {
          setData(res);
        })
        .catch((err) => {});
    }
  }, [cancelBtnClicked]);

  return (
    <Layout>
      {!createFlow && Object.keys(data).length == 0 ? (
        <LoaderIcon />
      ) : (
        <CreateProduct
          productData={data}
          createFlow={createFlow}
          productId={Number(productId)}
          setCancelBtnClicked={setCancelBtnClicked}
          cancelBtnClicked={cancelBtnClicked}
        />
      )}
    </Layout>
  );
};

export default ProductCreation;
