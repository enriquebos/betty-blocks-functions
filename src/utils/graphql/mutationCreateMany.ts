// @ts-nocheck
import { gqlRequest } from "./utils";

export default async function mutationCreateMany<T extends string>(modelName: T, records: object[]): Promise<number[]> {
  if (records.length === 0) {
    return Promise.resolve([]);
  }

  const response = await gqlRequest<{
    [key in `createMany${T}`]: { id: number }[];
  }>(
    `mutation {
      createMany${modelName}(input: $input) {
        id
      }
    }`,
    { input: records },
  );

  return response[`createMany${modelName}`].map((item) => item.id);
}
