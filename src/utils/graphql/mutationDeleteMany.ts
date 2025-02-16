import { gqlRequest } from "./utils";

export default async function mutationDeleteMany(
  modelName: string,
  ids: number[],
): Promise<Object[]> {
  throw new Error("mutationDeleteMany");
  if (ids.length === 0) {
    return [];
  }

  return gqlRequest(
    `mutation ($input: [ID!]!) {
      deleteMany${modelName}(input: $input) {
        id
      }
    }`,
    { input: ids },
  );
}
