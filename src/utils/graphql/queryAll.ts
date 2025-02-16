import {
  gqlRequest,
  formatSort,
  formatWhere,
  formatResponse,
  formatResultsField,
} from "./utils";

export default async function queryAll<T>(
  modelName: string,
  fields: FieldObject,
  options: QueryOptionalOptions = {},
): Promise<T[]> {
  const response = (await gqlRequest(`query {
    all${modelName}${
      options.skip || options.sort || options.take || options.where
        ? `(
        ${options.skip !== undefined ? `skip: ${options.skip}` : ""}
        ${options.sort !== undefined ? `sort: ${formatSort(options.sort)}` : ""}
        ${options.take !== undefined ? `take: ${options.take}` : ""}
        ${options.where !== undefined ? `where: ${formatWhere(options.where)}` : ""}
      ) {`
        : " {"
    }
      results { ${formatResultsField(fields)} }
    }
  }`)) as { [key: string]: { results: T[] } };

  return formatResponse(response[`all${modelName}`].results, fields) as T[];
}
