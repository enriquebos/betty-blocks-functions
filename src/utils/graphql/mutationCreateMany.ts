import { gqlRequest, generateRequest } from "./utils";
import { RequestMethod, RequestOperation } from "./enums";

export default async function mutationCreateMany(
  modelName: string,
  records: Record<string, unknown>[],
  _log_request?: boolean
): Promise<number[]> {
  if (records.length === 0) {
    return [];
  }

  const response = (await gqlRequest(
    generateRequest(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.CreateMany,
      {
        queryArguments: {
          input: records,
        },
      },
      _log_request
    )
  )) as Record<string, { id: number }[]>;

  return response[RequestOperation.CreateMany + modelName].map((item) => item.id);
}
