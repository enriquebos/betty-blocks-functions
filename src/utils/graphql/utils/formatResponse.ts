export default function formatResponse(
  response: object | object[],
  result: FieldObject,
): Record<string, any> | Record<string, any>[] {
  if (Array.isArray(response)) {
    return response.map((item) => formatResponse(item, result));
  }

  return Object.keys(result).reduce(
    (formatted, key) => {
      const valueFunc = result[key];
      const value = (response as Record<string, any>)[key];

      if (typeof valueFunc === "function") {
        formatted[key] = new valueFunc(value);
      } else if (typeof valueFunc === "object" && !(valueFunc instanceof Date)) {
        formatted[key] = formatResponse(value, valueFunc);
      } else {
        formatted[key] = value;
      }

      return formatted;
    },
    {} as Record<string, any>,
  );
}
