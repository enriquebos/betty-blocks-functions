import { gqlRequest } from "../utils";

export default async function createOrUpdateRecord(
  modelName: string,
  record: Record<string, any>,
  input: object,
  validates?: boolean,
): Promise<object> {
  const isUpdate = Boolean(record);
  const mutationName = isUpdate ? `update${modelName}` : `create${modelName}`;
  const mutation = `mutation {
    ${mutationName}(input: $input${isUpdate ? ", id: $id" : ""}) {
      id
    }
  }`;

  const data: { [key: string]: any } = await gqlRequest(mutation, {
    input,
    ...(isUpdate && { id: record.id }),
    validationSets: validates ? ["default"] : ["empty"],
  });

  return { ...data[mutationName], ...input };
}
