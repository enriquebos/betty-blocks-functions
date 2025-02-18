import { requestMethod, requestOperation } from "../enums";

function formatSort(sortObject: Sort): string {
  return JSON.stringify(sortObject).replaceAll('"', " ").replace(/\s:\s/g, ": ").replace(/\s,\s/g, ", ");
}

function formatWhere(whereObject: object): string {
  if (typeof whereObject === "string") {
    return `"${whereObject}"`;
  }
  if (Array.isArray(whereObject)) {
    return `[ ${whereObject.map(formatWhere).join(", ")} ]`;
  }
  if (typeof whereObject === "object" && whereObject !== null) {
    return `{ ${Object.entries(whereObject)
      .map(([key, value]) => `${key}: ${formatWhere(value)}`)
      .join(", ")} }`;
  }

  return String(whereObject);
}

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
  }
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
    requestArguments.push(`sort: ${formatSort(sort)}`);
  }

  if (take !== undefined) {
    if (take < 1 || take > 5000) {
      throw new Error("Take value must be between 1 and 5000");
    }
    requestArguments.push(`take: ${take}`);
  }

  if (where !== undefined) {
    requestArguments.push(`where: ${formatWhere(where)}`);
  }

  const graphqlRequest = `${type} {
    ${operation}${modelName}${requestArguments.length > 0 ? "(" + requestArguments.join(", ") + ")" : ""} {
      ${operation === "all" ? "results { " : ""}
      ${formatResultsField(options?.fields)}
      ${operation === "all" ? "}" : ""}
      ${totalCount ? "totalCount" : ""}
  } }`;

  return graphqlRequest;
}
