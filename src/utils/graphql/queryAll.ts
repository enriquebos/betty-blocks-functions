import { gqlRequest, formatResponse, generateRequest } from "./utils";
import { requestMethod, requestOperation } from "./enums";

export default async function queryAll<T>(
  modelName: string,
  options?: {
    fields?: Partial<Record<keyof T, any>>;
    queryArguments?: {
      skip?: number;
      sort?: Sort;
      take?: number;
      where?: object;
      totalCount?: boolean;
    };
  },
): Promise<{ totalCount: number; data: T[] }> {
  const response = (await gqlRequest(
    generateRequest<T>(modelName, requestMethod.Query, requestOperation.All, options),
  )) as {
    [key: string]: { results: T[]; totalCount: number };
  };

  return {
    totalCount: response[`all${modelName}`].totalCount,
    data: formatResponse(response[`all${modelName}`].results, options?.fields) as T[],
  };
}
