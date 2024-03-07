import React from "react";
import { useQuery } from "react-query";
import Card from "../../Common/Card/Card";
import Spinner from "../../Common/Spinner/Spinner";
import { socialAnalysis } from "../../../services/dashboard/dashboardService";

import Social1 from "@/assets/dashboard-tabs/social_1.png";
import Social2 from "@/assets/dashboard-tabs/social_2.png";
import Social3 from "@/assets/dashboard-tabs/social_3.png";

const SocialCards = () => {
  const { data, isLoading, isSuccess } = useQuery("ecomCards", socialAnalysis);
  const socialCardsData = isSuccess ? (data ? data.data : "") : "";

  const TabData = [
    {
      id: 1,
      name: "total_posts",
      text: isLoading ? (
        <Spinner />
      ) : isSuccess ? (
        socialCardsData.posts_count
      ) : (
        ""
      ),
      icon: <img src={Social1} alt="num_of_posts" />,
      className: "mr-5 bg-gradient-to-l to-[#E19EB3] from-[#DF4584]",
      firstText: "No of",
      secondText: "Active Posts",
    },
    {
      id: 2,
      name: "num_of_followers",
      text: isLoading ? (
        <Spinner />
      ) : isSuccess ? (
        socialCardsData.follower_count
      ) : (
        ""
      ),
      icon: <img src={Social2} alt="num_of_followers" />,
      className: "mr-5 bg-gradient-to-l to-[#CAEFFD] from-[#65CBF3]",
      firstText: "No of",
      secondText: "Followers",
    },
    {
      id: 3,
      name: "avg_engagement_rate",
      text: isLoading ? (
        <Spinner />
      ) : isSuccess ? (
        socialCardsData.engagement_rates
      ) : (
        ""
      ),
      icon: <img src={Social3} alt="avg_order_value" />,
      className: "bg-gradient-to-l to-[#F7D799] from-[#F9A603]",
      firstText: "Average",
      secondText: "Engagement Rate",
    },
  ];

  return (
    <div className="social-tab-cards flex flex-wrap space-x-5 ml-10">
      {TabData.map((socialCard) => (
        <div key={socialCard.id} className="my-10">
          <Card
            text={socialCard.text}
            firstText={socialCard.firstText}
            secondText={socialCard.secondText}
            cardClassName={socialCard.className}
            icon={socialCard.icon}
          />
        </div>
      ))}
    </div>
  );
};

export default SocialCards;
