import { httpVendor } from "../api-client";

export const previousOrdersListing = (page = 1, size = 10) => {
    const start = (page - 1) * size;
    const end = start + size;
    return httpVendor.get(
      `api/delivery/portal/subscription/orders?_start=${start}&_end=${end}&is_tom_data=false`
    );
  };