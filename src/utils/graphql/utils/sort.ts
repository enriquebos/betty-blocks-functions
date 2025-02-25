export function sortToString<T>(sort: T): string {
  const result = JSON.stringify(sort)
    .replaceAll('"', " ")
    .replaceAll(/\s:\s/g, ": ")
    .replaceAll(/\s,\s/g, ", ")
    .replaceAll(" :{", ": {")
    .replaceAll(/}+/g, (match: string) => match.split("").join(" "));

  return result.slice(2, result.length - 2);
}

export function sortToObject<T>(sort: string): T {
  return JSON.parse(`{${sort}}`.replace(/(\w+):/g, '"$1":').replace(/:\s*(\w+)/g, ': "$1"'));
}
