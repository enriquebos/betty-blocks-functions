import { gqlRequest, generateRequest, formatResponse } from "./utils";
import { requestMethod, requestOperation } from "./enums";

export default async function queryOne<T>(
  modelName: string,
  options?: {
    fields?: Partial<Record<keyof T, any>>;
    queryArguments?: {
      where?: object;
    };
  },
): Promise<T> {
  const response = (await gqlRequest<T>(
    generateRequest<T>(modelName, requestMethod.Query, requestOperation.One, options),
  )) as Record<string, object>;

  return formatResponse(response[`one${modelName}`], options?.fields) as T;
}
