// @ts-nocheck
import { gqlRequest } from "./utils";

export default async function mutationUpdate<T extends string>(
  modelName: T,
  id: number,
  partialRecord: object,
): Promise<number> {
  const response = await gqlRequest<{ [key in `update${T}`]: { id: number } }>(
    `mutation {
      update${modelName}(id: $id, input: $input) {
        id
      }
    }`,
    { id: id, input: partialRecord },
  );

  return response[`update${modelName}`].id;
}
