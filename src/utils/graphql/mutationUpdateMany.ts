// @ts-nocheck
import { gqlRequest } from "./utils";

export default async function mutationUpdateMany<T extends string>(
  modelName: T,
  partialRecord: object,
  where: object = {},
): Promise<number[]> {
  const response = await gqlRequest<{
    [key in `updateMany${T}`]: { id: number }[];
  }>(
    `mutation {
      updateMany${modelName}(where: $where, input: $input) {
        id
      }
    }`,
    { input: partialRecord, where: where },
  );

  return response[`updateMany${modelName}`].map((item) => item.id);
}
