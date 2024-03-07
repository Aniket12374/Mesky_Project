import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Input } from "antd";
import Button from "../../Common/Button";
import DataTable from "../../Common/DataTable/DataTable";
import { MdCreate } from "react-icons/md";
import { VscTrash } from "react-icons/vsc";
import { toast } from "react-hot-toast";
import {
  addProductPrice,
  deleteProductPrice,
  fetchProductPrice,
  updateProductPrice,
} from "../../../services/product/productService";

const PricingTab = ({ productId, skuId, data: pricingData, ...otherProps }) => {
  const [priceRecordData, setPriceRecordData] = useState("");
  const [update, setUpdate] = useState(false);
  const [action, setAction] = useState("");
  const [isFetching, setFetching] = useState(false);
  const [colData, setColData] = useState(pricingData);

  useEffect(() => {
    setFetching(true);
    fetchProductPrice(productId)
      .then((res) => {
        setColData(res?.data?.data);
        setFetching(false);
      })
      .catch((res) => setFetching(false));
  }, [update]);

  const handleDeletePrice = (data) => {
    setUpdate(true);
    const deletePriceData = {
      price_id: data.id,
      product_id: productId,
    };

    productId &&
      deleteProductPrice(deletePriceData)
        .then((res) => {
          setUpdate(false);
          setPriceRecordData("");
          toast.success(res.message, {
            position: "bottom-right",
          });
        })
        .catch((err) => {
          setUpdate(false);
          setPriceRecordData("");
          toast.success(err.message, {
            position: "bottom-right",
          });
        });
  };

  const PricingColumns = [
    {
      title: "SKU ID",
      dataIndex: "skuId",
      key: "skuId",
      align: "center",
      render: () => skuId,
    },
    {
      title: "PRODUCT VARIANT",
      dataIndex: "unit_quantity",
      key: "unit_quantity",
      align: "center",
    },
    {
      title: "SELLING PRICE",
      dataIndex: "selling_price",
      key: "selling_price",
      align: "center",
    },
    {
      title: "OFFER PRICE",
      dataIndex: "offer_price",
      key: "offer_price",
      align: "center",
    },
    {
      title: "PRODUCT SIZE",
      dataIndex: "product_size",
      key: "product_size",
      align: "center",
      render: (_, record) => record.product_spec?.product_size,
    },
    {
      title: "PRODUCT WEIGHT",
      dataIndex: "weight",
      key: "weight",
      align: "center",
      render: (_, record) => record.product_spec?.weight,
    },
    {
      title: "PRODUCT DIMENSION",
      dataIndex: "dimension",
      key: "dimension",
      align: "center",
      render: (_, record) => record.product_spec?.dimension,
    },
    {
      title: "TAX PERCENTAGE",
      dataIndex: "tax_percentage",
      key: "tax_percentage",
      align: "center",
      width: 120,
    },
    {
      title: "UNIT",
      dataIndex: "unit_size",
      key: "unit_size",
      align: "center",
    },
    {
      title: "UNIT PRICE",
      dataIndex: "unit_price",
      key: "unit_price",
      align: "center",
    },
    {
      title: "EDIT",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) => (
        <span
          onClick={() => {
            setAction("edit");
            setPriceRecordData(record);
          }}
          className="flex justify-center"
        >
          <MdCreate size={30} />
        </span>
      ),
    },
    {
      title: "DELETE",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) => (
        <span
          className="flex justify-center"
          onClick={() => {
            setAction("");
            handleDeletePrice(record);
          }}
        >
          <VscTrash size={30} />
        </span>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        data={colData}
        columns={PricingColumns}
        scroll={{ y: 180 }}
        loading={isFetching}
      />
      {action === "edit" || colData.length == 0 ? (
        <PricingForm
          // refetch={refetchPricingData}
          productId={productId}
          priceRecordData={priceRecordData}
          action={action}
          setUpdate={setUpdate}
          setAction={setAction}
          {...otherProps}
        />
      ) : null}
    </div>
  );
};

const PricingForm = ({
  productId,
  setUpdate,
  priceRecordData,
  action,
  setAction,
}) => {
  const initialValues = {
    unitQuantity: "",
    sellingPrice: "",
    offerPrice: "",
    taxPercentage: "",
    unit_size: "",
    unit_price: "",
    weight: "",
    dimension: "",
    product_size: "",
  };
  const [price, setPrice] = useState(initialValues);

  const handleChangePrice = (e, key) => {
    setPrice((prev) => ({ ...prev, [key]: e.target.value }));
  };

  useEffect(() => {
    const data = {
      unitQuantity: priceRecordData.unit_quantity,
      sellingPrice: priceRecordData.selling_price,
      offerPrice: priceRecordData.offer_price,
      taxPercentage: priceRecordData.tax_percentage,
      unit_size: priceRecordData.unit_size,
      unit_price: priceRecordData.unit_price,
      product_size: priceRecordData?.product_spec?.product_size,
      weight: priceRecordData?.product_spec?.weight,
      dimension: priceRecordData?.product_spec?.dimension,
    };
    setPrice(data);
  }, [priceRecordData]);

  const handleCancel = (e) => {
    e.preventDefault();
    setPrice(initialValues);
    setAction(null);
  };

  const onSubmit = (e, data) => {
    e.preventDefault();
    setUpdate(true);

    const createPriceData = {
      unit_quantity: data.unitQuantity,
      selling_price: data.sellingPrice,
      offer_price: data.offerPrice,
      product_id: productId,
      tax_percentage: +data.taxPercentage,
      unit_size: data.unit_size,
      unit_price: data.unit_price,
      net_weight: data?.product_size,
      weight: data?.weight,
      dimension: data?.dimension,
    };

    const updatePriceData = {
      ...createPriceData,
      id: priceRecordData.id,
    };

    const filled = Object.values(createPriceData).every((item) =>
      item ? true : false
    );

    if (!filled) {
      return toast.error("Please fill all the fields", {
        position: "bottom-right",
      });
    }

    const priceApi =
      action == "edit"
        ? updateProductPrice(updatePriceData)
        : addProductPrice(createPriceData);

    productId &&
      priceApi
        .then((res) => {
          toast.success("Successfully updated", {
            position: "bottom-right",
          });
          // refetch();
          setUpdate(false);
          setAction(null);
          setPrice(initialValues);
        })
        .catch((err) => {
          setUpdate(false);
          setAction("update");
          toast.success(err.message, {
            position: "bottom-right",
          });
        });
    e.stopPropagation();
  };

  return (
    <div className="mt-10">
      <div className="mb-10 text-center text-xl">PRODUCT PRICES FORM</div>
      <div className="flex justify-center pricing-form space-x-5 px-2">
        <Input
          suffix="Product Variant"
          name="unitQuantity"
          value={price.unitQuantity}
          onChange={(e) => handleChangePrice(e, "unitQuantity")}
          className="p-3 w-1/2"
        />
        <Input
          suffix="Selling Price"
          name="sellingPrice"
          value={price.sellingPrice}
          onChange={(e) => handleChangePrice(e, "sellingPrice")}
          className="p-3 w-1/2"
        />
      </div>
      <div className="flex justify-center pricing-form mt-5 space-x-5 px-2">
        <Input
          name="offerPrice"
          value={price.offerPrice}
          onChange={(e) => handleChangePrice(e, "offerPrice")}
          className="p-3 w-1/2"
          suffix="Offer Price"
        />
        <Input
          suffix="Tax Percentage"
          name="taxPercentage"
          value={price.taxPercentage}
          onChange={(e) => handleChangePrice(e, "taxPercentage")}
          className="p-3 w-1/2"
        />
      </div>

      <div className="flex justify-center pricing-form my-5 space-x-5 px-2">
        <Input
          name="unit_size"
          value={price.unit_size}
          onChange={(e) => handleChangePrice(e, "unit_size")}
          className="p-3 w-1/2"
          suffix="Unit"
        />
        <Input
          name="unit_price"
          className="p-3 w-1/2"
          value={price.unit_price}
          onChange={(e) => handleChangePrice(e, "unit_price")}
          suffix="Unit Price"
        />
      </div>
      <div className="flex pricing-form my-5 space-x-5 px-2">
        <Input
          suffix="Product Size"
          name="product_size"
          value={price.product_size}
          onChange={(e) => handleChangePrice(e, "product_size")}
          className="p-3 w-1/2"
        />
        <div className="flex space-x-2 w-full">
          <Input
            suffix="Product Weight (gms)"
            name="weight"
            value={price.weight}
            onChange={(e) => handleChangePrice(e, "weight")}
            className="p-3"
          />
          <Input
            suffix="Package Dimension (lxbxh) (cms)"
            name="dimension"
            value={price.dimension}
            onChange={(e) => handleChangePrice(e, "dimension")}
            className="p-3"
          />
        </div>
      </div>
      <div className="text-center">
        <Button
          btnName={!action ? "Add" : "Update"}
          onClick={(e) => {
            onSubmit(e, price);
          }}
          className="w-32"
        />
        <Button
          btnName={"Cancel"}
          cancelBtn
          onClick={handleCancel}
          className="w-32"
        />
      </div>
    </div>
  );
};

export default PricingTab;
