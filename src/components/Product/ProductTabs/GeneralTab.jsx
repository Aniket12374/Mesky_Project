import React, { useEffect, useState, useRef } from "react";
import { Controller } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import _ from "lodash";
import { Button, Input, Switch } from "antd";
import { FormInput, FormSelect, FormTextArea } from "../Form/FormComponents";

import {
  fetchCategories,
  getProductHashTags,
  fetchTypes,
  productStatusUpdate,
  updateProductAllowReturnable,
  updateProductStockOut,
} from "../../../services/product/productService";

const GeneralTab = ({
  setProduct,
  getProductValues,
  edit,
  control,
  productId,
  ...otherProps
}) => {
  const [subCatergoriesOption, setSubCatgOption] = useState([]);
  const [hashTags, setHashTags] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [types, setTypes] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [activeStatus, setActiveStatus] = useState(true);
  const [stockOut, setStockOut] = useState(false);
  const [returnable, setReturnable] = useState(false);

  const [howToUse, setHowToUse] = useState(getProductValues("howToUse"));
  const [description, setDescription] = useState(
    getProductValues("longDescription")
  );
  const [ingredients, setIngredients] = useState(
    getProductValues("ingredients")
  );

  const InputGeneralTabs = ({
    label,
    name,
    width = "",
    type = "text",
    required = true,
  }) => (
    <FormInput
      label={label}
      name={name}
      disabled={!edit}
      width={width}
      type={type}
      required={required}
      {...otherProps}
    />
  );

  useEffect(() => {
    fetchCategories().then((res) => {
      const categoriesRes = res.data?.data;
      setFinalData(categoriesRes);
      let selectedCategoryName = getProductValues("categoryName");
      let catgData = _.find(
        categoriesRes,
        (catg) => catg["title"] === selectedCategoryName
      );
      selectedCategoryName && setSubCatgOption(catgData["sub_categories"]);
      setActiveStatus(getProductValues("isActive"));
      setReturnable(getProductValues("returnable"));
      setStockOut(getProductValues("stockOut"));

      catgData &&
        fetchTypes(catgData.id)
          .then((res) => {
            setTypes(res);
            let subTypesList = res.find(
              (type) => type.id === getProductValues("typeId")
            )["subtypes"];

            setSubTypes(subTypesList);
          })
          .catch((err) => {});

      catgData &&
        getProductHashTags(catgData && catgData.id)
          .then((res) => setHashTags(res.data))
          .catch((err) => {});
    });
  }, []);

  const queryClient = useQueryClient();

  const handleChangeTags = (value) => {
    setProduct("tags", value ? value : []);
    let ids = [];
    value.map((tag) => {
      hashTags.filter((hashTag) => {
        if (hashTag.name === tag) return ids.push(Number(hashTag.id));
      });
    });

    setProduct("tagIds", ids);
  };

  const handleChangeSubType = (value) => {
    setProduct("subType", value ? value : "");
    let id = null;

    subTypes.filter((subType) => {
      if (subType.subtype_name === value) id = Number(subType.id);
    });

    setProduct("subTypeId", id);
  };

  const handleSelectCat = (event) => {
    setProduct("categoryName", event);
    setProduct("subCategoryName", []);
    setProduct("type", "");
    setProduct("subType", "");

    let categoryOptions = finalData.find((catg) => catg["title"] === event);
    let categoryId = categoryOptions["id"];
    categoryOptions && setProduct("categoryId", categoryId);
    categoryOptions && setSubCatgOption(categoryOptions["sub_categories"]);

    getProductHashTags(categoryId)
      .then((res) => {
        setHashTags(res.data);
      })
      .catch((err) => {});

    fetchTypes(categoryId)
      .then((res) => setTypes(res))
      .catch((err) => {});
  };

  const handleStatus = () => {
    setActiveStatus(!activeStatus);
    const statusData = { enable: !activeStatus ? 1 : 0, id: productId };

    productStatusUpdate(statusData).then((res) => {
      setProduct("isActive", !activeStatus);
      queryClient.invalidateQueries(["vendorProducts"]);
    });
  };

  const handleReturnable = () => {
    setReturnable(!returnable);
    const status = {
      id: productId,
      status: !returnable,
    };

    updateProductAllowReturnable(status)
      .then((res) => {
        setProduct("returnable", !returnable);
        queryClient.invalidateQueries(["vendorProducts"]);
      })
      .catch((err) => {});
  };

  const handleStockOut = () => {
    setStockOut(!stockOut);

    const stockOutData = {
      id: productId,
      stock_out: !stockOut,
    };

    updateProductStockOut(stockOutData)
      .then((res) => {
        setProduct("stockOut", !stockOut);
        queryClient.invalidateQueries(["vendorProducts"]);
      })
      .catch((err) => {});
  };

  const handleChangeTextArea = (event, key) => {
    if (key === "howToUse") {
      setHowToUse(event.target.value);
    }
    if (key === "longDescription") {
      setDescription(event.target.value);
    }
    if (key === "ingredients") {
      setIngredients(event.target.value);
    }
    setProduct(key, event.target.value);
  };

  const handleChangeSubCategory = (e) => {
    setProduct("subCategoryName", e);
    let ids = [];
    e.map((x) => {
      return subCatergoriesOption.filter((y) => {
        if (y.subcategory_name === x) {
          ids.push(y.id);
        }
      });
    });

    setProduct("subcategoryIdList", ids);
  };

  const handleChangeType = (e) => {
    let id;
    types.filter((y) => {
      if (y.display_name === e) {
        id = y.id;
        setSubTypes(y.subtypes);
      }
    });

    setProduct("type", e);
    setProduct("typeId", id);
  };

  return (
    <div className="mt-10 px-10">
      <div className="flex items-center flex-wrap">
        <InputGeneralTabs label="Short Name" name="shortName" width="w-1/2" />
        <div>
          <div className="text-[#A8A8A8]">Product Live?</div>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                {...field}
                style={{
                  backgroundColor: activeStatus ? "#65CBF3" : "#E2E2EA",
                  margin: "0 10px",
                }}
                checked={activeStatus}
                onChange={handleStatus}
              />
            )}
          />
        </div>
        <div className="mx-14">
          <div className="text-[#A8A8A8]">Accept Returns?</div>
          <Controller
            name="returnable"
            control={control}
            render={({ field }) => (
              <Switch
                {...field}
                style={{
                  backgroundColor: returnable ? "#65CBF3" : "#E2E2EA",
                  margin: "0 10px",
                }}
                checked={returnable}
                onChange={handleReturnable}
              />
            )}
          />
        </div>
        <div>
          <div className="text-[#A8A8A8]"> In Stock?</div>
          <Controller
            name="stockOut"
            control={control}
            render={({ field }) => (
              <Switch
                {...field}
                style={{
                  backgroundColor: !stockOut ? "#65CBF3" : "#E2E2EA",
                  margin: "0 10px",
                }}
                checked={!stockOut}
                onChange={handleStockOut}
              />
            )}
          />
        </div>
      </div>
      <div className="mt-5">
        <InputGeneralTabs label="Full Name" name="longName" />
      </div>

      <div className="flex space-x-3 mt-5">
        <InputGeneralTabs label="SKU ID" name="skuId" width="w-1/4" />
        <InputGeneralTabs label="HSN Code" name="hsnCode" width="w-1/4" />
        <FormSelect
          label="Category"
          control={control}
          name="categoryName"
          className="w-1/2"
          options={_.map(finalData, (item) => ({
            label: item.title,
            value: item.title,
            id: item.id,
          }))}
          disabled={!edit}
          onChange={handleSelectCat}
          multi={false}
        />
      </div>

      <div className="flex space-x-3 mt-5">
        <FormSelect
          label="Type"
          name="type"
          className="w-1/2"
          options={types.map((type) => ({
            label: type.display_name,
            value: type.display_name,
          }))}
          disabled={!edit}
          control={control}
          onChange={handleChangeType}
          multi={false}
        />

        <FormSelect
          label="Sub-Categories"
          name="subCategoryName"
          className="w-1/2"
          maxTagCount={5}
          options={subCatergoriesOption.map((option) => ({
            label: option.subcategory_name,
            value: option.subcategory_name,
          }))}
          disabled={!edit}
          onChange={handleChangeSubCategory}
          mode="multiple"
          multi
          control={control}
          text="Select upto 5 Sub-Categories"
        />
      </div>

      <div className="flex mt-5 space-x-3">
        <FormSelect
          label="Sub-Types"
          name="subType"
          control={control}
          className="w-full"
          options={subTypes.map((tag) => ({
            label: tag.subtype_name,
            value: tag.subtype_name,
          }))}
          disabled={!edit}
          onChange={handleChangeSubType}
        />
        <FormSelect
          label="Tags"
          name="tags"
          control={control}
          maxTagCount={10}
          mode="multiple"
          multi
          className="w-full"
          options={hashTags.map((tag) => ({
            label: tag.name,
            value: tag.name,
          }))}
          disabled={!edit}
          onChange={handleChangeTags}
          text="Select upto 10 Tags"
        />
        {/* <div className="flex ml-3 w-1/2"> */}
        {/* <InputGeneralTabs
            label="Package Weight (gms)"
            name="weight"
            type="number"
          />
          <InputGeneralTabs
            label="Package Dimension (lxbxh) (cms)"
            name="dimension"
          /> */}
        {/* </div> */}
      </div>

      <div className="mt-5">
        <FormTextArea
          label="Description"
          name="longDescription"
          value={description}
          onChange={(e) => handleChangeTextArea(e, "longDescription")}
          {...otherProps}
          disabled={!edit}
          control={control}
          required={true}
        />
      </div>
      <div className="flex space-x-3 my-5">
        <FormTextArea
          label="Ingredients"
          name="ingredients"
          value={ingredients}
          onChange={(e) => handleChangeTextArea(e, "ingredients")}
          required={false}
          control={control}
          disabled={!edit}
        />
        <FormTextArea
          label="How to Use"
          name="howToUse"
          value={howToUse}
          onChange={(e) => handleChangeTextArea(e, "howToUse")}
          required={false}
          control={control}
          disabled={!edit}
        />
      </div>
    </div>
  );
};

export default GeneralTab;
