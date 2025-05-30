import { getAllValues } from "../../utilityFuncs";

export function validateSortObject<T>(sort: T): void {
  const allowedKeys = ["field", "order", "relation"];
  const sortKeys = Object.keys(sort);
  const invalidKeys = sortKeys.filter((key) => !allowedKeys.includes(key));
  let sortType;

  if (invalidKeys.length !== 0) {
    throw new Error(`Invalid key(s) passed in sort object: ${invalidKeys.join(", ")}`);
  }

  if (sortKeys.includes("relation")) {
    if (sortKeys.length !== 1) {
      throw new Error("'order' or 'field' cannot be defined when 'relation' key is defined");
    }

    const objectValues = getAllValues(sort);
    if (objectValues.length !== 1) {
      throw new Error("A sort object relation cannot have more than one sort order defined");
    }

    sortType = objectValues[0];
  } else if (sortKeys.includes("field") || sortKeys.includes("order")) {
    if (sortKeys.length !== 2) {
      throw new Error("Both field and order have to be defined in a sort object");
    }
    sortType = (sort as any).order;
  }

  if (!["ASC", "DESC"].includes(sortType)) {
    throw new Error(`Sort object order has to be either ASC or DESC not '${sortType}' (case sensitive)`);
  }
}

export function sortToString<T>(sort: T, validate: boolean = true): string {
  if (validate) {
    validateSortObject(sort);
  }

  const result = JSON.stringify(sort)
    .replaceAll('"', " ")
    .replaceAll(/\s:\s/g, ": ")
    .replaceAll(/\s,\s/g, ", ")
    .replaceAll(" :{", ": {")
    .replaceAll(/}+/g, (match: string) => match.split("").join(" "));

  return result.slice(2, result.length - 2);
}

export function sortToObject<T>(sort: string, validate: boolean = true): T {
  const parsed = JSON.parse(`{${sort}}`.replace(/(\w+):/g, '"$1":').replace(/:\s*(\w+)/g, ': "$1"'));

  if (validate) {
    validateSortObject(parsed);
  }
  return parsed;
}
