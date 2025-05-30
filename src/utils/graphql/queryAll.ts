import { gqlRequest, formatResponse, generateRequest } from "./utils";
import { RequestMethod, RequestOperation } from "./enums";

export default async function queryAll<T>(
  modelName: string,
  options: {
    fields: Partial<Record<keyof T, any>>;
    queryArguments?: {
      skip?: number;
      sort?: Sort;
      take?: number;
      where?: object;
      totalCount?: boolean;
    };
    _log_request?: boolean;
  }
): Promise<{ totalCount: number; data: T[] }> {
  const response = (await gqlRequest(
    generateRequest<T>(modelName, RequestMethod.Query, RequestOperation.All, options, options._log_request)
  )) as {
    [key: string]: { results: T[]; totalCount: number };
  };

  if (!response || !response[`all${modelName}`]) {
    return { totalCount: 0, data: [] };
  }

  return {
    totalCount: response[`all${modelName}`].totalCount,
    data: formatResponse(response[RequestOperation.All + modelName].results, options?.fields) as T[],
  };
}
