import { gqlRequest } from "./utils";

export default async function mutationCreate<T extends string>(
  modelName: T,
  record: object,
): Promise<number> {
  const response = await gqlRequest<{ [key in `create${T}`]: { id: number } }>(
    `mutation {
      create${modelName}(input: $input) {
        id
      }
    }`,
    { input: record },
  );

  return response[`create${modelName}`].id;
}
