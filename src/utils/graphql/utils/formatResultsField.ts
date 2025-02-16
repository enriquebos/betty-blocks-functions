export default function buildResultsField(fields: FieldObject): string {
  let query = "";

  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === "object") {
      query += `\n  ${key} { ${buildResultsField(value)} }`;
    } else {
      query += `\n  ${key}`;
    }
  }

  return query;
}
