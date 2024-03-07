import React from "react";
import { useQuery } from "react-query";
import Card from "../../Common/Card/Card";
import Spinner from "../../Common/Spinner/Spinner";
import { ecommerceAnalysis } from "../../../services/dashboard/dashboardService";

import ActiveProductsImg from "@/assets/dashboard-tabs/active-products.png";
import AvgOrderImg from "@/assets/dashboard-tabs/avg_order.png";
import GmvImg from "@/assets/dashboard-tabs/gmv.png";
import ShoopingCartImg from "@/assets/dashboard-tabs/shopping-cart.png";
import TotalOrdersImg from "@/assets/dashboard-tabs/total-orders.png";
import { useNavigate } from "react-router-dom";

export const EcommerceCards = () => {
  let navigate = useNavigate();
  const { data, isLoading, isSuccess, isError, error } = useQuery(
    "ecomCards",
    ecommerceAnalysis
  );

  if (!navigator.onLine || isError || error) {
    return navigate("/login");
  }

  const ecomCardsData = isSuccess ? (data ? data.data : "") : "";
  const gmv = +ecomCardsData.total_gmv;
  function kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  const Ecards = [
    {
      id: 1,
      name: "active_orders",
      text: isLoading ? (
        <Spinner />
      ) : isSuccess ? (
        ecomCardsData.active_orders
      ) : (
        ""
      ),
      icon: <img src={ShoopingCartImg} alt="num_of_active_orders" />,
      className: "bg-gradient-to-l to-[#E19EB3] from-[#DF4584]",
      firstText: "No of",
      secondText: "Open Orders",
    },
    {
      id: 2,
      name: "orders",
      text: isLoading ? (
        <Spinner />
      ) : isSuccess ? (
        ecomCardsData.total_orders
      ) : (
        ""
      ),
      icon: <img src={TotalOrdersImg} alt="num_of_total_orders" />,
      className: "bg-gradient-to-l to-[#EEB2AB] from-[#FC8172]",
      firstText: "Total",
      secondText: "Orders",
    },
    {
      id: 3,
      name: "gmv",
      text: isLoading ? <Spinner /> : isSuccess ? "₹" + kFormatter(gmv) : "",
      icon: <img src={GmvImg} alt="total_gmv" />,
      className: "bg-gradient-to-l to-[#F7D799] from-[#F9A603]",
      firstText: "Total",
      secondText: "GMV",
    },
    {
      id: 4,
      name: "active_products",
      text: isLoading ? (
        <Spinner />
      ) : isSuccess ? (
        ecomCardsData.active_products
      ) : (
        ""
      ),
      icon: <img src={ActiveProductsImg} alt="num_of_active_products" />,
      className: "bg-gradient-to-l to-[#CAEFFD] from-[#65CBF3]",
      firstText: "No of",
      secondText: "Active Products",
    },
    {
      id: 5,
      name: "order_value",
      text: isLoading ? (
        <Spinner />
      ) : isSuccess ? (
        "₹" + kFormatter(ecomCardsData.average_order_value)
      ) : (
        ""
      ),
      icon: <img src={AvgOrderImg} alt="avg_order_value" />,
      className: "bg-gradient-to-l to-[#CD99E7] from-[#AA00FF]",
      firstText: "Average",
      secondText: "Order Value",
    },
  ];

  return (
    <div className="ecommerce-tab-cards flex justify-center flex-wrap space-x-10">
      {Ecards.map((ecard) => (
        <div key={ecard.id} className="my-5">
          <Card
            text={ecard.text}
            firstText={ecard.firstText}
            secondText={ecard.secondText}
            cardClassName={ecard.className}
            icon={ecard.icon}
          />
        </div>
      ))}
    </div>
  );
};

export default EcommerceCards;
