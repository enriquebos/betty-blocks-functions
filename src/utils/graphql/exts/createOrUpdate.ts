import { gqlRequest } from "../utils";

export default async function createOrUpdateRecord(
  modelName: string,
  record: Record<string, unknown>,
  input: unknown,
  validates?: boolean
): Promise<object> {
  const isUpdate = Boolean(record);
  const mutationName = isUpdate ? `update${modelName}` : `create${modelName}`;
  const mutation = `mutation {
    ${mutationName}(input: $input${isUpdate ? ", id: $id" : ""}) {
      id
    }
  }`;

  const data = (await gqlRequest(mutation, {
    input,
    ...(isUpdate && typeof record.id === "number" ? { id: record.id as number } : {}),
    validationSets: validates ? ["default"] : ["empty"],
  })) as Record<string, unknown>;

  return { ...(data[mutationName] as object), ...(input as object) };
}
