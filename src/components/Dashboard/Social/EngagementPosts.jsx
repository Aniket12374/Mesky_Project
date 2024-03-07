import React from "react";
import { useQuery } from "react-query";
import { socialTopPosts } from "../../../services/dashboard/dashboardService";
import Spinner from "../../Common/Spinner/Spinner";

const EngagementPosts = () => {
  const { data, isLoading } = useQuery("Engagement Posts", socialTopPosts);
  const postsData = data?.data.map((post) => {
    let media = post.media_info;
    return media[0].media_url;
  });

  return (
    <div className="social-tab-engagement-posts mt-5 ml-10 ">
      <div className="mb-4 text-2xl text-[#A8A8A8] font-medium">
        Top 5 Posts based on Engagement
      </div>
      <EngagementCard postsData={postsData} loading={isLoading} />
    </div>
  );
};

const EngagementCard = ({ img, postsData, loading }) => {
  return (
    <div className="engagement-card-img grid grid-cols-6 gap-5">
      {!loading ? (
        postsData &&
        postsData.map((imgSource, index) => (
          <img
            src={imgSource}
            alt="post image"
            className="h-56  object-cover rounded-lg"
            key={index}
          />
        ))
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default EngagementPosts;
