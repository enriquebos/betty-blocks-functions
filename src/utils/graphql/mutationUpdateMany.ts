import { gqlRequest } from "./utils";

export default async function mutationUpdateMany(
  modelName: string,
  where: string,
  partialRecords: Object[],
): Promise<Object[]> {
  throw new Error("mutationUpdateMany");
  if (partialRecords.length === 0) {
    return [];
  }

  return gqlRequest(
    `mutation ($where: String!, $input: [${modelName}Input!]!) {
      updateMany${modelName}(where: $where, input: $input) {
        id
      }
    }`,
    { where: where, input: partialRecords },
  );
}
