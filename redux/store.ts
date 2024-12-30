import { configureStore } from "@reduxjs/toolkit";
import resourceSlice from "@/redux/slice/resource";
import user from "@/redux/slice/user";
import language from "@/redux/slice/language";
import companies from "@/redux/slice/companies";
import scenario from "@/redux/slice/scenario";
import education from "@/redux/slice/education";
import campaign from "@/redux/slice/campaign";

export const makeStore = () => {
  return configureStore({
    reducer: {
      resource: resourceSlice,
      user,
      language,
      companies,
      scenario,
      education,
      campaign,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
