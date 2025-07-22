import { gqlRequest } from "../utils";

export default async function createOrUpdateRecord(
  modelName: string,
  record: Record<string, unknown> | null | undefined,
  input: Record<string, unknown>,
  validates = false,
): Promise<Record<string, unknown>> {
  const isUpdate = Boolean(record);
  const mutationName = isUpdate ? `update${modelName}` : `create${modelName}`;
  const mutation = `
    mutation($input: JSON${isUpdate ? ", $id: Int" : ""}) {
      ${mutationName}(input: $input${isUpdate ? ", id: $id" : ""}) {
        id
      }
    }
  `;

  const variables: Record<string, unknown> = {
    input,
    validationSets: validates ? ["default"] : ["empty"],
  };

  if (isUpdate && typeof record?.id === "number") {
    variables.id = record.id;
  }

  const data = (await gqlRequest(mutation, variables)) as Record<string, unknown>;
  const dataKey = mutationName in data ? mutationName : Object.keys(data)[0];

  return {
    ...input,
    ...(data[dataKey] as Record<string, unknown>),
  };
}
