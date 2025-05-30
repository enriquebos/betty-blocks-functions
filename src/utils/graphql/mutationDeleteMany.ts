import { gqlRequest, generateRequest } from "./utils";
import { RequestMethod, RequestOperation } from "./enums";

export default async function mutationDeleteMany(
  modelName: string,
  ids: number[],
  _log_request?: boolean,
): Promise<number[]> {
  if (ids.length === 0) {
    return [];
  }

  const response = (await gqlRequest(
    generateRequest(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.DeleteMany,
      {
        queryArguments: {
          input: { ids },
        },
      },
      _log_request,
    ),
  )) as Record<string, { id: number }[]>;

  return response[RequestOperation.DeleteMany + modelName].map((item) => item.id);
}
