export function whereToString<T>(where: T): string {
  if (Array.isArray(where)) {
    return `[${where.map(whereToString).join(", ")}]`;
  }

  if (typeof where === "object" && where !== null) {
    return `{ ${Object.entries(where)
      .map(([key, value]) => `${key}: ${whereToString(value)}`)
      .join(", ")} }`;
  }

  return typeof where === "string" ? `"${where}"` : String(where);
}

export function whereToObject<T>(where: string): T {
  return JSON.parse(`{${where}}`.replace(/(\w+):/g, '"$1":'));
}
