export function prefixUrl (prefix) {
  return function (requestParams) {
    const { url = '' } = requestParams;
    return {
      ...requestParams,
      url: `${prefix}${url}`,
    };
  };
}
