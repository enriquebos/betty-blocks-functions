import { requestMethod, requestOperation } from "../enums";
import { whereToString } from "./where";
import { sortToString } from "./sort";

function formatResultsField<T>(fields: Partial<Record<keyof T, any>> | undefined): string {
  if (fields === undefined || Object.keys(fields).length === 0) {
    return "id";
  }

  let query = "";
  const keys = Object.keys(fields);
  const lastKey = keys[keys.length - 1];

  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === "object") {
      if (value !== null) {
        query += `\n  ${key} { ${formatResultsField(value)} }`;
      }
    } else {
      query += `\n  ${key}`;
    }

    if (key !== lastKey) {
      query += ",";
    }
  }
  return query;
}

export default function generateRequest<T>(
  modelName: string,
  type: requestMethod,
  operation: requestOperation,
  options?: {
    fields?: Partial<Record<keyof T, any>>;
    queryArguments?: {
      skip?: number;
      sort?: Sort;
      take?: number;
      where?: object;
      totalCount?: boolean;
    };
  },
): string {
  const { skip, sort, take, where, totalCount } = options?.queryArguments || {};
  let requestArguments: string[] = [];

  if (skip !== undefined) {
    if (skip < 0 || skip > 2147483647) {
      throw new Error("Skip value must be between 0 and 2147483647 (32bit)");
    }
    requestArguments.push(`skip: ${skip}`);
  }

  if (sort !== undefined) {
    requestArguments.push(`sort: { ${sortToString(sort)} }`);
  }

  if (take !== undefined) {
    if (take < 1 || take > 5000) {
      throw new Error("Take value must be between 1 and 5000");
    }
    requestArguments.push(`take: ${take}`);
  }

  if (where !== undefined) {
    requestArguments.push(`where: { ${whereToString(where)} }`);
  }

  const graphqlRequest = `${type} {
    ${operation}${modelName}${requestArguments.length > 0 ? "(" + requestArguments.join(", ") + ")" : ""} {
      ${operation === "all" ? "results { " : ""}
      ${formatResultsField(options?.fields)}
      ${operation === "all" ? "}" : ""}
      ${totalCount ? "totalCount" : ""}
  } }`;

  console.log(graphqlRequest);

  return graphqlRequest;
}
