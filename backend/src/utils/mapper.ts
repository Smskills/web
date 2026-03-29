/**
 * Utility to convert snake_case database rows to camelCase frontend objects
 */
export function mapToCamelCase(obj: any): any {
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
}

/**
 * Utility to convert camelCase frontend objects to snake_case database rows
 */
export function mapToSnakeCase(obj: any): any {
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
}
