// @ts-nocheck
import { gqlRequest } from "./utils";

export default async function mutationDelete<T extends string>(modelName: T, id: number): Promise<number> {
  const response = await gqlRequest<{ [key in `delete${T}`]: { id: number } }>(
    `mutation {
      delete${modelName}(id: $id) {
        id
      }
    }`,
    { id: id },
  );

  return response[`delete${modelName}`].id;
}
