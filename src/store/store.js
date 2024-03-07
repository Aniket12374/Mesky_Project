import { create } from "zustand";
import { createAuthSlice } from "./auth";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const mainStore = (...params) => ({
  ...createAuthSlice(...params),
  // ...createNewSlice(...params),
});

export const useMainStore = create(
  import.meta.env.VITE_ENV === "dev"
    ? devtools(immer(mainStore))
    : immer(mainStore)
);
