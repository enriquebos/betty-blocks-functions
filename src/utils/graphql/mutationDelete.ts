import { gqlRequest } from "./utils";

export default async function mutationDelete(
  modelName: string,
  id: number,
): Promise<{ string: { id: number } }> {
  throw new Error("mutationDelete");
  return await gqlRequest(
    `mutation ($id: ID!) {
      delete${modelName}(id: $id) {
        id
      }
    }`,
    { id: id },
  );
}
