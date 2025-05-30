import { gqlRequest, generateRequest } from "./utils";
import { RequestMethod, RequestOperation } from "./enums";

export default async function mutationDelete(modelName: string, id: number, _log_request?: boolean): Promise<number> {
  const response = (await gqlRequest(
    generateRequest(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.Delete,
      {
        queryArguments: {
          id: id,
        },
      },
      _log_request,
    ),
  )) as Record<string, { id: number }>;

  return response[RequestOperation.Delete + modelName].id;
}
