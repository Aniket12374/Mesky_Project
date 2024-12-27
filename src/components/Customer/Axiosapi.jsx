import axios from "axios";
import React, { useEffect } from "react";

const Axiosapi = () => {
  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users").then((response) => {
      console.log(response);
    });
  }, []);

  return <></>;
};
