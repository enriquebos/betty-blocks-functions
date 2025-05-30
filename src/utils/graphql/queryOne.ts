import { gqlRequest, generateRequest, formatResponse } from "./utils";
import { RequestMethod, RequestOperation } from "./enums";

export default async function queryOne<T>(
  modelName: string,
  options: {
    fields: Partial<Record<keyof T, any>>;
    queryArguments?: {
      where?: object;
    };
    _log_request?: boolean;
  },
): Promise<T | null> {
  const response = (await gqlRequest<T>(
    generateRequest<T>(modelName, RequestMethod.Query, RequestOperation.One, options, options?._log_request),
  )) as Record<string, object>;

  if (!response || !response[RequestOperation.One + modelName]) {
    return null;
  }

  return formatResponse(response[RequestOperation.One + modelName], options?.fields) as T;
}
