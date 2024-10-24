import { configureStore } from "@reduxjs/toolkit";
import resourceSlice from "@/redux/slice/resource";
import user from "@/redux/slice/user";
import language from "@/redux/slice/language";

export const makeStore = () => {
  return configureStore({
    reducer: { resource: resourceSlice, user, language },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
