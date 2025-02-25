// @ts-nocheck
import { gqlRequest } from "./utils";

export default async function mutationDeleteMany<T extends string>(modelName: T, ids: number[]): Promise<number[]> {
  if (ids.length === 0) {
    return Promise.resolve([]);
  }

  const response = await gqlRequest<{
    [key in `deleteMany${T}`]: { id: number }[];
  }>(
    `mutation {
      deleteMany${modelName}(input: $input) {
        id
      }
    }`,
    { input: { ids: ids } },
  );

  return response[`deleteMany${modelName}`].map((item) => item.id);
}
