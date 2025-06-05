import { gqlRequest, generateRequest } from "./utils";
import { RequestMethod, RequestOperation } from "./enums";

export default async function mutationUpdateMany(
  modelName: string,
  partialRecord: Record<string, unknown>,
  options?: {
    where?: object;
    _log_request?: boolean;
  }
): Promise<number[]> {
  const response = (await gqlRequest(
    generateRequest(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.UpdateMany,
      {
        queryArguments: {
          where: options?.where,
          input: partialRecord,
        },
      },
      options?._log_request
    )
  )) as Record<string, { id: number }[]>;

  return response[RequestOperation.UpdateMany + modelName].map((item) => item.id);
}
