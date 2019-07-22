export function pickNonNull (src, keyNames) {

  const result = {};

  Object.entries(src).forEach(([key, value]) => {
    if (value != null && keyNames.includes(key)) {
      result[key] = value;
    }
  });

  return result;
}
