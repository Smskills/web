
export const mapToCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => mapToCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/(_\w)/g, m => m[1].toUpperCase())]: mapToCamelCase(obj[key]),
      }),
      {},
    );
  }
  return obj;
};

export const mapToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => mapToSnakeCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)]: mapToSnakeCase(obj[key]),
      }),
      {},
    );
  }
  return obj;
};
