import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "antd";
import Button from "../Common/Button";
import Tabs from "../Common/Tabs/Tabs";
import GeneralTab from "./ProductTabs/GeneralTab";
import { Header } from "../../utils";
import MediaTab from "./ProductTabs/MediaTab";
import PricingTab from "./ProductTabs/PricingTab";
import ProductQA from "./ProductTabs/ProductQA";
import { useMainStore } from "../../store/store";
import {
  defaultValues,
  TransformFormData,
  TransformToFormData,
} from "./ProductTabs/utils";

import {
  productCreate,
  productEdit,
  bulkQA,
  getBulkQAs,
  updateBulkQA,
} from "../../services/product/productService";
import classNames from "classnames";

const QAns1 = [
  {
    name: "Q1",
    question: "",
    ans: "",
    suffixQ: "Q1",
    suffixA: "A1",
    key: 1,
    id: 0,
  },
];

const CreateProduct = (props) => {
  const {
    register,
    handleSubmit,
    setValue: setProduct,
    getValues: getProductValues,
    control,
  } = useForm({ defaultValues });

  const {
    createFlow,
    productData,
    productId,
    cancelBtnClicked,
    setCancelBtnClicked,
  } = props;
  const [edit, setEdit] = useState(createFlow);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideos, setPreviewVideos] = useState([]);
  const [imageLinks, setImageLinks] = useState([]);
  const [videoLinks, setVideoLinks] = useState([]);
  const [questionAns, setQuestionAnswers] = useState([]);

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const getImages = (imgs) => {
    const imags = [...imgs];
    setImages(imags);
  };
  const getVideos = (vds) => {
    const videosLinks = [...vds];
    setVideos(videosLinks);
  };

  const brand = useMainStore((state) => state.brand);
  const queryClient = useQueryClient();
  let navigate = useNavigate();

  useEffect(() => {
    const formData = !createFlow
      ? TransformToFormData(productData)
      : defaultValues;

    //Register the fields in the react-hook-form
    Object.keys(formData).forEach((key) => setProduct(key, formData[key]));
    productData && setPreviewImages(productData["images_list"]);
    productData && setPreviewVideos(productData["videoUrls"]);
    productData && getQA();
  }, []);

  const CreateTabs = {
    General: {
      tabData: (
        <GeneralTab
          register={register}
          setProduct={setProduct}
          getProductValues={getProductValues}
          edit={edit}
          control={control}
          productId={productId}
        />
      ),
      enabled: true,
    },
    Media: {
      tabData: (
        <MediaTab
          getProductValues={getProductValues}
          previewImages={previewImages}
          setPreviewImages={setPreviewImages}
          setPreviewVideos={setPreviewVideos}
          previewVideos={previewVideos}
          setImageLinks={setImageLinks}
          setVideoLinks={setVideoLinks}
          getImages={getImages}
          getVideos={getVideos}
          disabled={!edit}
          cancelBtnClicked={cancelBtnClicked}
          {...props}
        />
      ),
      enabled: true,
    },
    Pricing: {
      tabData: (
        <PricingTab
          register={register}
          skuId={productData.sku_id}
          data={productData.product_price_list}
          {...props}
        />
      ),
      enabled: !createFlow,
    },
    "Product Q & A": {
      tabData: (
        <ProductQA
          register={register}
          edit={edit}
          questionAns={questionAns}
          setQuestionAnswers={setQuestionAnswers}
          {...props}
        />
      ),
      enabled: !createFlow,
    },
  };

  const ProductTabs = Object.keys(CreateTabs).filter(
    (tab) => CreateTabs[tab]["enabled"]
  );

  const handleCancel = (e) => {
    setCancelBtnClicked(true);
    e.preventDefault();
    setEdit(false);
    getQA();
  };

  const getQA = () => {
    getBulkQAs(productId)
      .then((res) => {
        let qaData = res.data;
        let final = [];

        qaData.forEach((x, index) => {
          let obj = {
            name: `Q${index + 1}`,
            question: x.question,
            ans: x.answer,
            suffixQ: `Q${index + 1}`,
            suffixA: `A${index + 1}`,
            key: `${index + 1}`,
            id: x.id,
          };
          final.push(obj);
        });
        final.length === 0 ? QAns1 : final;

        setQuestionAnswers(final);
      })
      .catch((err) => {
        if (
          err?.response?.data?.message === "QA for this product does not exist"
        ) {
          setQuestionAnswers(QAns1);
        }
      });
  };

  const handleQA = () => {
    let submitQAs1 = [];
    let submitQAs2 = [];
    let QA1 = questionAns.filter((x) => x.id === 0);
    let QA2 = questionAns.filter((x) => x.id !== 0);

    QA1.length &&
      QA1.map((x) => {
        let obj = {
          question: x.question,
          answer: x.ans,
        };
        obj["question"] && obj["answer"] && submitQAs1.push(obj);
      });

    QA2.length > 0 &&
      QA2.map((x) => {
        let obj = {
          question: x.question,
          answer: x.ans,
          id: x.id,
        };
        obj["question"] && obj["answer"] && submitQAs2.push(obj);
      });

    let data1 = {
      productId: productId,
      questionAnswers: submitQAs1,
    };

    submitQAs1.length > 0 &&
      bulkQA(data1)
        .then((res) => {})
        .catch((err) => {});

    submitQAs2.length > 0 &&
      updateBulkQA(submitQAs2)
        .then((res) => {})
        .catch((err) => {});
  };

  const onSubmit = (data) => {
    setProduct("imagesList", imageLinks);
    setProduct("videoUrls", videoLinks);
    data["imagesList"] = [...imageLinks];
    data["videoUrls"] = videoLinks?.map((link) => ({
      is_video: true,
      media_url: link,
    }));
    data["brandId"] = brand.brand_id;
    let submitData = TransformFormData(data);

    if (!createFlow) {
      submitData["id"] = productId;
      productId &&
        productEdit(productId, submitData)
          .then((res) => {
            toast.success("product edited succesfully", {
              position: "bottom-right",
            });
            setEdit(false);
            queryClient.invalidateQueries(["vendorProducts"]);
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message, {
              position: "bottom-right",
            });
            setEdit(true);
          });
      questionAns && handleQA();
    } else
      productCreate(submitData)
        .then((res) => {
          toast.success("product created succesfully", {
            position: "bottom-right",
          });
          queryClient.invalidateQueries(["vendorProducts"]);
          setEdit(false);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message, {
            position: "bottom-right",
          });
          setEdit(true);
        });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setEdit(!edit);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between">
        <div>
          <Header text="Products" />
          {!createFlow && (
            <Breadcrumb
              items={[
                {
                  title: <a onClick={() => navigate("/products")}>Products</a>,
                },
                {
                  title: `${productData["name"]}`,
                },
              ]}
            />
          )}
        </div>
        <div className="flex justify-end p-2">
          <Button
            btnName="Cancel"
            className={classNames("bg-[#A8A8A8] text-black w-32", {
              hidden: !edit,
            })}
            onClick={(e) => handleCancel(e)}
            cancelBtn={true}
          />
          <Button
            btnName={edit ? "Save" : "Edit"}
            className="w-32"
            onClick={(e) => (!edit ? handleEdit(e) : {})}
          />
        </div>
      </div>
      <Tabs
        tabHeaders={ProductTabs}
        tabsContent={ProductTabs.map((tab) => CreateTabs[tab]["tabData"])}
        tabsContentClassName="product-content"
      />
    </form>
  );
};

export default CreateProduct;
