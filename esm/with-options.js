export function withOptions (options = {}) {
  return (requestParams) => {
    return { ...requestParams, ...options };
  };
}
