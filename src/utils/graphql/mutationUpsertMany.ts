// @ts-nocheck
import { gqlRequest } from "./utils";

export default async function mutationUpsertMany<T extends string>(modelName: T, records: object[]): Promise<number[]> {
  if (records.length === 0) {
    return Promise.resolve([]);
  }

  const response = await gqlRequest<{
    [key in `upsertMany${T}`]: { id: number }[];
  }>(
    `mutation {
      upsertMany${modelName}(input: $input) {
        id
      }
    }`,
    { input: records },
  );

  return response[`upsertMany${modelName}`].map((item) => item.id);
}
