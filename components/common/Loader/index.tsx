"use client"
import React from "react";

type ILoader = {
  className?:string
}
const Loader :React.FC<ILoader>= ({className=""}) => {
  return (
    <div className={"flex h-screen items-center justify-center bg-white dark:bg-black "+className}>
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loader;
