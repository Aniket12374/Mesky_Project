import { useEffect, useState } from "react";
import classNames from "classnames";
import Button from "../../components/Common/Button";
import Spinner from "../../components/Common/Spinner/Spinner";
import Layout from "../../components/Layout/Layout";
import GeneratePost from "../../components/Posts/GeneratePost/GeneratePost";
import PostPreview from "../../components/Posts/PostPreview/PostPreview";
import { Header, linkTpe } from "../../utils";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  editPost,
  getHashTags,
  getPostDetails,
} from "../../services/post/postService";
import { toast } from "react-hot-toast";

const EditPost = () => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [previewImages, setPreviewImages] = useState([]);
  const [editable, setEditable] = useState(false);
  const [cancelClicked, setCancelClicked] = useState(false);

  const [post, setPost] = useState({
    post_id: params.id,
    // category: null,
    product: null,
    description: null,
    tags: [],
    brand: null,
  });

  const [images, setImages] = useState([]);
  const getImages = (imgs) => {
    const imags = [...imgs];
    setImages(imags);
  };

  const { data, isLoading } = useQuery(["editPost", params.id], getPostDetails);

  const { mutate: saveEditPost } = useMutation(editPost, {
    onSuccess: () => {
      toast.success("Post updated", {
        position: "bottom-right",
      });
      queryClient.invalidateQueries(["vendorPosts"]);
      navigate("/posts");
    },
    onError: () => {
      toast.error("Error! Please try again!", {
        position: "bottom-right",
      });
    },
  });

  const postData = data?.data;

  useEffect(() => {
    postData &&
      getHashTags().then((res) => {
        let hashTags = res?.data;
        let postTags = postData?.hashtags;
        let hashtagIds = [];

        hashTags.forEach((tag) =>
          postTags.filter((x) =>
            tag.tag == x ? hashtagIds.push(tag.id) : null
          )
        );
        setPost((prev) => ({ ...prev, tags: hashtagIds }));
      });

    setPost({
      ...post,
      // category: postData?.category_id,
      product: postData?.product_id,
      description: postData?.description,
      brand: postData?.brand_id,
    });

    const images = postData?.media_info.map((media, index) => {
      return {
        id: index.toString(),
        name: index.toString(),
        thumb: media.media_url,
        type: linkTpe(media.media_url),
      };
    });
    setPreviewImages(images ?? []);
  }, [postData, cancelClicked]);

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
      post_id: params.id,
      // category_id,
      brand_id,
      product_id,
      description,
      tags,
      media_urls,
    };

    saveEditPost(obj);
  };

  return (
    <Layout>
      <div className="post-headers flex justify-between">
        <div className="flex">
          <div
            className="text-3xl font-bold mr-2 cursor-pointer"
            onClick={() => navigate("/posts")}
          >
            {"<"}
          </div>
          <Header text="Post" className="" />
        </div>

        {/* Edit Button */}
        <Button
          btnName={"Edit"}
          className={classNames(" w-32", {
            hidden: editable,
          })}
          onClick={(e) => {
            e.preventDefault();
            setEditable(true);
            setCancelClicked(false);
          }}
        />

        {/* Save and Cancel buttons */}
        {editable && (
          <div className="flex justify-end">
            <Button
              btnName="Cancel"
              cancelBtn={true}
              className="w-32"
              onClick={(e) => {
                e.preventDefault();
                setCancelClicked(true);
                setEditable(false);
              }}
            />
            <Button
              btnName={"Save"}
              onClick={() => submitForm(images)}
              className="w-32"
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
            btnText={"Edit post"}
            getImages={getImages}
            editable={editable}
          />
        </div>
        <PostPreview post={post} images={images} />
      </section>
    </Layout>
  );
};

export default EditPost;
