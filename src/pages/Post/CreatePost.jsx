import React, { useState } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

import Button from "../../components/Common/Button";
import Spinner from "../../components/Common/Spinner/Spinner";
import Layout from "../../components/Layout/Layout";
import GeneratePost from "../../components/Posts/GeneratePost/GeneratePost";
import PostPreview from "../../components/Posts/PostPreview/PostPreview";

import { createPost } from "../../services/post/postService";
import { Header, linkTpe } from "../../utils";

const CreatePost = () => {
  const [post, setPost] = useState({
    category: null,
    product: null,
    description: null,
    tags: [],
    brand: null,
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [images, setImages] = useState([]);
  const [editable, setEditable] = useState(false);

  const getImages = (imgs) => {
    const imags = [...imgs];
    setImages(imags);
  };
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const resetForm = () => {
    setPost({
      category: null,
      product: null,
      description: null,
      tags: [],
      brand: null,
    });
    setPreviewImages([]);
  };

  const { mutate: addPost, isLoading } = useMutation(createPost, {
    onSuccess: () => {
      resetForm();
      toast.success("Post created successfully!", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries(["vendorPosts"]);
      setEditable(false);
    },
    onError: () => {
      toast.error("Error! Please try again!", {
        position: "bottom-right",
      });
    },
  });

  const submitForm = (imageLinks) => {
    const {
      // category: category_id,
      product: product_id,
      brand: brand_id,
      description: description,
      tags,
    } = post;

    const media_urls = imageLinks.map((link) => ({
      is_video: linkTpe(link) === "video" ? true : false,
      media_url: link,
    }));

    const obj = {
      // category_id,
      brand_id,
      product_id,
      description,
      tags,
      media_urls,
    };

    addPost(obj);
  };

  return (
    <Layout>
      <div className="flex justify-between">
        <Header text="Create posts" />
        <Button
          btnName={"Create"}
          className={classNames("w-32", {
            hidden: editable,
          })}
          onClick={(e) => {
            e.preventDefault();
            setEditable(true);
          }}
        />
        {editable && (
          <div>
            <Button
              btnName="Cancel"
              className={classNames("bg-[#A8A8A8] w-32 text-black")}
              onClick={(e) => navigate("/posts")}
              cancelBtn={true}
            />
            <Button
              btnName="Save"
              className="w-32"
              onClick={() => submitForm(images)}
            />
          </div>
        )}
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
        <div>
          <div>{isLoading ? <Spinner /> : null}</div>
          <GeneratePost
            post={post}
            setPost={setPost}
            submitForm={submitForm}
            previewImages={previewImages}
            setPreviewImages={setPreviewImages}
            btnText={"Create post"}
            getImages={getImages}
            editable={editable}
          />
        </div>
        <PostPreview post={post} images={images} />
      </section>
    </Layout>
  );
};

export default CreatePost;
