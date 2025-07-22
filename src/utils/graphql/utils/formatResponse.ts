export default function formatResponse(
  response: object | object[],
  result?: FieldObject
): Record<string, unknown> | Record<string, unknown>[] {
  if (Array.isArray(response)) {
    return response.map((item) => {
      const formatted = formatResponse(item, result);

      if (Array.isArray(formatted)) {
        throw new Error("Nested arrays are not supported");
      }
      return formatted;
    });
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
    {} as Record<string, unknown>
  );
}
