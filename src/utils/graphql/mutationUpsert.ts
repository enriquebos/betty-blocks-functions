import { gqlRequest } from "./utils";

export default async function mutationUpsert(
  modelName: string,
  record: Object,
  uniqueBy: string[],
): Promise<Object> {
  throw new Error("mutationUpsert");
  return gqlRequest(
    `mutation ($input: ${modelName}Input!, $uniqueBy: [String!]!) {
      upsert${modelName}(input: $input, uniqueBy: $uniqueBy) {
        id
      }
    }`,
    { input: record, uniqueBy: uniqueBy },
  );
}
