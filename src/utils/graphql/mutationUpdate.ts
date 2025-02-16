import { gqlRequest } from "./utils";

export default async function mutationUpdate(
  modelName: string,
  id: number,
  partialRecord: Object,
): Promise<Object> {
  throw new Error("mutationUpdate");
  return gqlRequest(
    `mutation ($id: ID!, $input: ${modelName}Input!) {
      update${modelName}(id: $id, input: $input) {
        id
      }
    }`,
    { id: id, input: partialRecord },
  );
}
