export function whereToString<T>(where: T, _isRoot: boolean = true): string {
  if (Array.isArray(where)) {
    return `[${where.map((item) => whereToString(item, false)).join(", ")}]`;
  }

  if (typeof where === "object" && where !== null) {
    const content = Object.entries(where)
      .map(([key, value]) => `${key}: ${whereToString(value, false)}`)
      .join(", ");
    return _isRoot ? content : `{ ${content} }`;
  }

  return typeof where === "string" ? `"${where}"` : String(where);
}

export function whereToObject<T>(where: string): T {
  return JSON.parse(`{${where}}`.replace(/(\w+):/g, '"$1":'));
}
