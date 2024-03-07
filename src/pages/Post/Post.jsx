import { Link, useNavigate } from "react-router-dom";
import { Popover, Switch } from "antd";
import { useQuery } from "react-query";
import DataTable from "../../components/Common/DataTable/DataTable";
import Layout from "../../components/Layout/Layout";
import Spinner from "../../components/Common/Spinner/Spinner";

import { Header, linkTpe } from "../../utils";
import { FaInstagram } from "react-icons/fa";
import {
  getVendorPosts,
  changePostStatus,
} from "../../services/post/postService";
import InfiniteScrollWrapper from "../../components/InfiniteScroll/Wrapper";
import { useCallback, useEffect, useState } from "react";

const Post = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refetchPosts, setRefreshPosts] = useState(false);
  const [totalLength, setTotalLength] = useState(null);
  let navigate = useNavigate();

  const vendorPosts = [
    {
      title: "MEDIA",
      dataIndex: "media",
      key: "media",
      align: "center",
      width: "200px",
      render: (_, record) => {
        const getAllImages = () => (
          <div className="grid grid-cols-3 gap-4">
            {record.media.map((med) => (
              <img
                className="object-fill mt-2 rounded-lg h-12 w-12"
                key={med.id}
                src={med.media_url}
                alt="_"
              />
            ))}
          </div>
        );

        return (
          <>
            <div className="flex justify-center space-x-3">
              {record.media.slice(0, 3).map((med) =>
                linkTpe(med.media_url) === "image" ? (
                  <img
                    className="object-fill mt-2 rounded-lg h-12 w-12"
                    key={med.id}
                    src={med.media_url}
                    alt="_"
                  />
                ) : (
                  <video height="45" width="45">
                    <source alt={med.media_url} src={med.media_url} />
                  </video>
                )
              )}
            </div>
            {record.media.length > 3 ? (
              <Popover content={getAllImages()}>
                <div className="cursor-pointer">Show more</div>
              </Popover>
            ) : (
              ""
            )}
          </>
        );
      },
    },
    {
      title: "CAPTION",
      dataIndex: "caption",
      key: "caption",
      align: "center",
      width: 200,
      render: (caption) => (
        <div>
          {caption.length > 60 ? caption.slice(0, 60) + "...." : caption}
        </div>
      ),
    },
    {
      title: "POST DATE",
      dataIndex: "post_date",
      key: "post_date",
      align: "center",
      width: 150,
    },
    {
      title: "LIKES",
      dataIndex: "likes",
      key: "likes",
      align: "center",
    },
    {
      title: "COMMENTS",
      dataIndex: "comments",
      key: "comments",
      align: "center",
    },
    {
      title: "SHARES",
      dataIndex: "shares",
      key: "shares",
      align: "center",
    },
    {
      title: "ENGAGEMENT RATES",
      dataIndex: "enagement_rates",
      key: "enagement_rates",
      align: "center",
    },
    {
      title: "ACTIVE STATUS",
      dataIndex: "active",
      key: "active",
      align: "center",
      render: (_, record) => {
        let data = {
          enable: !record.active,
          postId: record.id,
        };
        return (
          <Switch
            style={{
              backgroundColor: record["active"] ? "#65CBF3" : "#E2E2EA",
            }}
            checked={record.active}
            onChange={() => {
              setRefreshPosts(true);

              changePostStatus(data)
                .then(() => {
                  setData([]);
                  setLoading(true);
                  fetchMoreData(0);
                  setLoading(false);
                  setRefreshPosts(false);
                })
                .catch((err) => {
                  setData([]);
                  setLoading(true);
                  fetchMoreData(0);
                  setLoading(false);
                  setRefreshPosts(false);
                });
            }}
          />
        );
      },
    },
  ];

  useEffect(() => {
    fetchMoreData(0);
  }, []);

  const fetchMoreData = useCallback(
    (start) => {
      try {
        getVendorPosts(start).then((res) => {
          if (res?.status === 200) {
            setLoading(false);
            setTotalLength(res.data.totalCount);
            let colData = [];
            colData = res.data?.data
              ?.sort((a, b) => new Date(b.product_id) - new Date(a.product_id))
              .map((data) => ({
                id: data.id,
                caption: data.description,
                post_date: data.created_date,
                likes: data.like_count,
                comments: data.comment_count,
                shares: data.share_count,
                media: data.media_info,
                active: data.is_active,
              }));
            let modifiedData = [...data, ...colData];
            let set = new Set(modifiedData);

            setData(Array.from(set));
          }
        });
      } catch (error) {
        console.log("error", error.message);
      }
    },
    [data]
  );

  return (
    <Layout>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Header text="Posts" className="" />
            <div className="flex space-x-2">
              {/* <button className="insta-bg py-2 px-14 rounded-3xl drop-shadow-lg text-white fredoka-600 flex items-center space-x-3">
                <div>Create post from </div>
                <FaInstagram />
              </button> */}
              <Link to="/posts/create">
                <button className="py-2 px-10 rounded-3xl drop-shadow-lg text-white fredoka-600 bg-pink-600">
                  Create post
                </button>
              </Link>
            </div>
          </div>
          <div>
            {/* <DataTable
              data={colData}
              navigateTo={"/posts/edit/"}
              columns={vendorPosts}
              scroll={{
                y: 430,
              }}
              // pagination
            /> */}

            <InfiniteScrollWrapper
              isInfiniteScrollOn={true}
              lengthData={data.length}
              functionNext={fetchMoreData}
              totalLength={totalLength}
            >
              <DataTable
                data={data}
                navigateTo={"/posts/edit/"}
                columns={vendorPosts}
                loading={loading}
                pagination
              />
            </InfiniteScrollWrapper>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Post;
