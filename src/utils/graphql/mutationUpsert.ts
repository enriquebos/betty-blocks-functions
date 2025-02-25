// @ts-nocheck
import { gqlRequest } from "./utils";

export default async function mutationUpsert<T extends string>(
  modelName: T,
  record: object,
  uniqueBy: string[],
): Promise<number> {
  const response = await gqlRequest<{ [key in `upsert${T}`]: { id: number } }>(
    `mutation {
      upsert${modelName}(input: $input, uniqueBy: $uniqueBy) {
        id
      }
    }`,
    { input: record, uniqueBy: uniqueBy },
  );

  return response[`upsert${modelName}`].id;
}
