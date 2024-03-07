import { getCookie } from "../services/cookiesFunc";

const userInitialInfo = () => {
  const token = getCookie("token") ? getCookie("token") : "";
  const email = "";
  const name = "";
  return { token, email, name };
};

export const createAuthSlice = (set) => ({
  // { token, email, name }
  user: { ...userInitialInfo() },
  brand: {
    brand_id: -1,
    brand_name: "",
    email: "",
    phoneNumber: "",
    alternateNumber: "",
    first_name: "",
    last_name: "",
  },

  setUser: (user) => {
    set((state) => {
      state.user = user;
    });
  },
  setName: (name) => {
    set((state) => {
      state.user.name = name;
    });
  },
  setBrand: (
    brand_id,
    brand_name,
    phoneNumber,
    alternateNumber,
    default_email,
    firstName,
    secondName,
    registered_name,
    registered_address,
    delivery_pay_by,
    line_1,
    line_2,
    reg_state,
    city,
    pincode
  ) => {
    set((state) => {
      state.brand.brand_id = brand_id;
      state.brand.brand_name = brand_name;
      state.brand.phoneNumber = phoneNumber;
      state.brand.email = default_email;
      state.brand.alternateNumber = alternateNumber;
      state.brand.first_name = firstName;
      state.brand.last_name = secondName;
      state.brand.registered_name = registered_name;
      state.brand.registered_address = registered_address;
      state.brand.address_line_1 = line_1;
      state.brand.address_line_2 = line_2;
      state.brand.state = reg_state;
      state.brand.city = city;
      state.brand.pincode = pincode;
      state.brand.delivery_pay_by = delivery_pay_by;
    });
  },
  setUserToken: (token) => {
    set((state) => {
      state.user.token = token;
    });
  },
  logoutUser: () => {
    set((state) => {
      state.user = { token: "", email: "", name: "" };
    });
  },
});
