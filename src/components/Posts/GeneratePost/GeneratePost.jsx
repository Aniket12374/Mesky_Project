import { Select, Input } from "antd";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import DragDropImage from "../../Common/DragDropImage/DragDropImage";
import {
  getBrandsOfUser,
  getCategories,
  getHashTags,
  getProductNames,
  getProducts,
} from "../../../services/post/postService";
import { useMainStore } from "../../../store/store";

const { TextArea } = Input;

const GeneratePost = ({
  post,
  setPost,
  submitForm,
  previewImages,
  setPreviewImages,
  getImages,
  editable,
}) => {
  const [brandList, setBrandList] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hashTags, setHashTags] = useState([]);

  const [imageLinks, setImageLinks] = useState([]);
  const brandId = useMainStore((state) => state.brand.brand_id);

  useEffect(() => {
    getBrandsOfUser()
      .then((res) => {
        setBrandList(res.data.data);
        setPost((prev) => ({
          ...prev,
          brand: res.data.data[0].id,
        }));
      })
      .catch((err) => console.log(err));

    getCategories()
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.log(err));

    getHashTags()
      .then((res) => setHashTags(res.data))
      .catch((err) => console.log(err));

    getProductNames(brandId)
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.log(err));
  }, [brandId]);

  const handleCategoryChange = (value) => {
    setPost((prev) => ({ ...prev, category: value ? value : "" }));
  };

  const handleProductChange = (value) => {
    setPost((prev) => ({ ...prev, product: value ? value : "" }));
  };

  const handleTagChange = (value) => {
    setPost((prev) => ({ ...prev, tags: value ? value : [] }));
  };

  const handleDescriptionChange = (event) => {
    setPost((prev) => ({
      ...prev,
      description: event.target.value ? event.target.value : "",
    }));
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    submitForm(imageLinks);
  };

  return (
    <section className="px-20">
      <form className="flex flex-col space-y-6" onSubmit={onFormSubmit}>
        {/* category */}
        {/* <div>
          <label className="select-label">Category</label>
          <Select
            showSearch
            allowClear={true}
            size="large"
            value={post.category}
            placeholder="Category"
            optionFilterProp="children"
            onChange={handleCategoryChange}
            style={{ width: "100%" }}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={categories?.map((cat) => ({
              value: cat.id,
              label: cat.title,
            }))}
            disabled={!editable}
          />
        </div> */}

        {/* product */}
        <div>
          <label className="select-label">Product</label>
          <Select
            showSearch
            allowClear={true}
            size="large"
            value={
              products.find((x) => x.id == post.product)
                ? products.find((x) => x.id == post.product)["name"]
                : null
            }
            placeholder="Product"
            onChange={handleProductChange}
            optionFilterProp="children"
            style={{ width: "100%" }}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={products.map((product) => ({
              label: product.name,
              value: product.id,
            }))}
            disabled={!editable}
          />
        </div>

        {/* description */}
        <div>
          <label className="select-label">Description</label>
          <TextArea
            size="large"
            rows={6}
            value={post.description}
            onChange={handleDescriptionChange}
            placeholder="Description"
            disabled={!editable}
            autoSize
          />
        </div>

        {/* tags */}
        <div>
          <label className="select-label">Select/Create Tags</label>
          <Select
            mode="multiple"
            allowClear
            optionFilterProp="label"
            style={{
              width: "100%",
            }}
            className="multi-select w-full p-2"
            value={post.tags}
            onChange={handleTagChange}
            size="large"
            placeholder="Tag"
            disabled={!editable}
            options={hashTags.map((tag) => ({ label: tag.tag, value: tag.id }))}
          />
        </div>

        {/* select images */}
        <DragDropImage
          preview={previewImages}
          setPreview={setPreviewImages}
          setImageLinks={setImageLinks}
          onImageChange={getImages}
          label="Post Media"
          allow={["image/jpg", "image/jpeg", "image/png", "video/mp4"]}
          disabled={!editable}
          maxCount={5}
        />

        {/* submit button */}
      </form>
    </section>
  );
};

GeneratePost.propTypes = {
  setPost: PropTypes.func,
};

export default GeneratePost;
