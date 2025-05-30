import { gqlRequest, generateRequest } from "./utils";
import { RequestMethod, RequestOperation } from "./enums";

export default async function mutationCreate(modelName: string, input: any, _log_request?: boolean): Promise<number> {
  const response = (await gqlRequest(
    generateRequest(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.Create,
      {
        queryArguments: {
          input: input,
        },
      },
      _log_request,
    ),
  )) as Record<string, { id: number }>;

  return response[RequestOperation.Create + modelName].id;
}
