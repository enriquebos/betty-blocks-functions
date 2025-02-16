export default function formatWhere(obj: any): string {
  if (typeof obj === "string") {
    return `"${obj}"`;
  }
  if (Array.isArray(obj)) {
    return `[ ${obj.map(formatWhere).join(", ")} ]`;
  }
  if (typeof obj === "object" && obj !== null) {
    return `{ ${Object.entries(obj)
      .map(([key, value]) => `${key}: ${formatWhere(value)}`)
      .join(", ")} }`;
  }

  return String(obj);
}
