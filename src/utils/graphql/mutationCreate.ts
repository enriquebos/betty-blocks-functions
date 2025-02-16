import { gqlRequest } from "./utils";

export default async function mutationCreate(
  modelName: string,
  record: Object,
): Promise<Object> {
  throw new Error("mutationCreate");
  return gqlRequest(
    `mutation ($input: ${modelName}Input!) {
      create${modelName}(input: $input) {
        id
      }
    }`,
    { input: record },
  );
}
