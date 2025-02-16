import { gqlRequest } from "./utils";

export default async function mutationUpsertMany(
  modelName: string,
  records: Object[],
): Promise<Object[]> {
  throw new Error("mutationUpsertMany");
  if (records.length === 0) {
    return [];
  }

  return gqlRequest(
    `mutation ($input: [${modelName}Input!]!) {
      upsertMany${modelName}(input: $input) {
        id
      }
    }`,
    { input: records },
  );
}
