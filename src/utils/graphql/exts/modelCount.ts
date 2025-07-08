import { gqlRequest, generateRequest } from "../utils";
import { RequestMethod, RequestOperation } from "../enums";

export default async function modelCount(
  modelName: string,
  options: {
    where?: object;
    _log_request?: boolean;
  } = {},
): Promise<number> {
  const response = (await gqlRequest(
    generateRequest(
      modelName,
      RequestMethod.Query,
      RequestOperation.All,
      {
        queryArguments: {
          where: options.where,
          totalCount: true,
          take: 1,
        },
      },
      options._log_request,
    ),
  )) as Record<string, { totalCount: number }>;

  return response[RequestOperation.All + modelName].totalCount;
}
