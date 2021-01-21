export function pickNonNull (src, keyNames) {

  const result = {};

  if (src != null) {
    Object.entries(src).forEach(([key, value]) => {
      if (value != null && keyNames.includes(key)) {
        result[key] = value;
      }
    });
  }

  return result;
}
