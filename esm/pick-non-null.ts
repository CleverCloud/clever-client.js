export function pickNonNull<T extends object>(src: T, keyNames: Array<keyof T>): Partial<T> {
  const result: Partial<T> = {};

  if (src != null) {
    const keys = Object.keys(src) as Array<keyof T>;
    keys.forEach((key) => {
      const value = src[key];
      if (value != null && keyNames.includes(key)) {
        result[key] = value;
      }
    });
  }

  return result;
}
