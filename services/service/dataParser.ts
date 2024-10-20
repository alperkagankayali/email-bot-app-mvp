const parseError = (result: any) => {
  return {
    message: result.message || result.message || result.data,
    status: result.status,
    color: "danger",
    errStatus: true,
  };
};

const parseSuccess = (result: any) => {
  return {
    data: result,
    message: result.message,
    status: result.status,
    color: "success",
    errStatus: false,
  };
};

export const parseResult = (result: any) => {
  if (result.status === "error") {
    return parseError(result);
  }
  return parseSuccess(result);
};

export const parseCompileResult = (result: any) => {
  return { data: result };
};
