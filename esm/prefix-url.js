export function prefixUrl (prefix) {

  return function (requestParams) {

    return {
      ...requestParams,
      url: `${prefix}${requestParams.url}`,
    };
  };
}
