import { gqlRequest, generateRequest, formatResponse } from "./utils";
import { RequestMethod, RequestOperation } from "./enums";

export default async function queryOne<T extends { id: number }>(
  modelName: string,
  options: {
    fields?: Partial<Record<keyof T, unknown>>;
    queryArguments?: {
      where?: object;
    };
    _log_request?: boolean;
  },
): Promise<T | null> {
  const rawResponse = await gqlRequest<T>(
    generateRequest<T>(modelName, RequestMethod.Query, RequestOperation.One, options, options?._log_request),
  );
  const response = rawResponse as unknown as Record<string, object>;

  if (!response || !response[RequestOperation.One + modelName]) {
    return null;
  }

  return formatResponse(
    response[RequestOperation.One + modelName],
    (options?.fields || { id: Number }) as FieldObject,
  ) as T;
}
