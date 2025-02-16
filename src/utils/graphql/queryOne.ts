import {
  gqlRequest,
  formatWhere,
  formatResultsField,
  formatResponse,
} from "./utils";

export default async function queryOne<T>(
  modelName: string,
  fields: FieldObject,
  where: object = {},
): Promise<T> {
  const response = (await gqlRequest(`query {
    one${modelName}${Object.keys(where).length !== 0 ? `(where: ${formatWhere(where)})` : ""} {
      ${formatResultsField(fields)}
    }
  }`)) as Record<string, object>;

  return formatResponse(response[`one${modelName}`], fields) as T;
}
