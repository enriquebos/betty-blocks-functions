import { gqlRequest, generateRequest } from "./utils";
import { RequestMethod, RequestOperation } from "./enums";

export default async function mutationUpdate(
  modelName: string,
  id: number,
  partialRecord: object,
  _log_request?: boolean,
): Promise<number> {
  const response = (await gqlRequest(
    generateRequest(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.Update,
      {
        queryArguments: {
          id,
          input: partialRecord,
        },
      },
      _log_request,
    ),
  )) as Record<string, { id: number }>;

  return response[RequestOperation.Update + modelName].id;
}
