/* eslint-disable @typescript-eslint/no-explicit-any */

export default function formatResponse(
  response: object | object[],
  result?: FieldObject,
): Record<string, any> | Record<string, any>[] {
  if (Array.isArray(response)) {
    return response.map((item) => formatResponse(item, result));
  }

  if (!result) return {};

  return Object.keys(result).reduce(
    (formatted, key) => {
      const valueFunc = result[key];
      const value = (response as Record<string, unknown>)[key];

      if (typeof valueFunc === "function") {
        if (valueFunc === Date) {
          formatted[key] = new Date(value as Date);
        } else {
          formatted[key] = valueFunc(value);
        }
      } else if (typeof valueFunc === "object" && !(valueFunc instanceof Date)) {
        formatted[key] = formatResponse(value as object, valueFunc);
      } else {
        formatted[key] = value;
      }

      return formatted;
    },
    {} as Record<string, any>,
  );
}
