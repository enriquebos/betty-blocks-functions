export default function formatSort(obj: Sort): string {
  return JSON.stringify(obj).replaceAll('"', "");
}
