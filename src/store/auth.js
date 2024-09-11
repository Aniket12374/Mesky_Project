import { getCookie } from "../services/cookiesFunc";

const userInitialInfo = () => {
  const token = getCookie("token") ? getCookie("token") : "";
  const email = "";
  const name = "";
  const closeSidebar = "";
  return { token, email, name, closeSidebar };
};

export const createAuthSlice = (set) => ({
  user: { ...userInitialInfo() },
  customerTokenChanged: false,
  sidebarOpen: true,

  setCustomerTokenChanged: () => {
    set((state) => {
      state.customerTokenChanged = !state.customerTokenChanged;
    });
  },

  setSideBarOpen: () => {
    set((state) => {
      state.sidebarOpen = !state.sidebarOpen;
    });
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
