// @ts-nocheck
function formatResponse(response: object | object[], result: FieldObject): Record<string, any> | Record<string, any>[] {
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

export default async function gqlRequest<T>(
  operation: string,
  input: {
    input?: T | T[];
    id?: number;
    where?: object;
    uniqueBy?: string[];
  } = {},
): Promise<T> {
  if (operation.length > 4194304) {
    throw new Error(`GraphQL request length exceeds maximum allowed size (${operation.length} vs 4194304)`);
  }

  // @ts-expect-error: Cannot find name 'gql'
  const { data, errors } = await gql(operation, input);

  if (errors) {
    throw errors;
  }

  return data;
}
