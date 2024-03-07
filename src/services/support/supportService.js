import { httpVendor } from "../api-client";

export const createTicket = (data) => {
  return httpVendor.post("/api/vendor/ticket/support/create", {
    description: data,
  });
};
