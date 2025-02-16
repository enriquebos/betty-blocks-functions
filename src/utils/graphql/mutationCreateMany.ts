import { gqlRequest } from "./utils";

export default async function mutationCreateMany(
  modelName: string,
  records: Object[],
): Promise<Object[]> {
  console.error(records);
  if (records.length === 0) {
    return [];
  }

  return await gqlRequest(
    `mutation ($input: [${modelName}Input!]!) {
      createMany${modelName}(input: $input) {
        id
      }
    }`,
    { input: records },
  );
}
