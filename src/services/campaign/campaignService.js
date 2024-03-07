import { httpVendor } from "../api-client";

export const getCamapignDetails = () => {
  return httpVendor.get("/api/vendor/collaborator/details");
};

export const readyToCollaborate = (data) => {
  return httpVendor.post("/api/vendor/collaborator/add", {
    ready_to_collaborate: data,
  });
};

export const updateCommission = (data) => {
  return httpVendor.post("/api/vendor/collaborator/commission/update", {
    commission_type: "Percentage",
    commission_structure: [
      {
        price_range: "0-500",
        commission: data.commission1,
      },
      {
        price_range: "500-1000",
        commission: data.commission2,
      },
      {
        price_range: "1000-1500",
        commission: data.commission3,
      },
      {
        price_range: "1500-2000",
        commission: data.commission3,
      },
      {
        price_range: "Above 2000",
        commission: data.commission4,
      },
    ],
  });
};
