import { gqlRequest, generateRequest } from "./utils";
import { RequestMethod, RequestOperation } from "./enums";

export default async function mutationUpsert(
  modelName: string,
  record: Record<string, unknown>,
  uniqueBy: string[],
  _log_request?: boolean,
): Promise<number> {
  const response = (await gqlRequest(
    generateRequest(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.Upsert,
      {
        queryArguments: {
          input: record,
          uniqueBy: uniqueBy,
        },
      },
      _log_request,
    ),
  )) as Record<string, { id: number }>;

  return response[RequestOperation.Upsert + modelName].id;
}
