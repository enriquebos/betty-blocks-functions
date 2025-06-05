export default function replaceTemplateVariables(
  text: string | undefined,
  variables: { key: string; value: string }[]
): string {
  if (!text) {
    return "";
  }

  const regex = /\{\{(!|&|\{)?\s*(.*?)\s*}}+/g;
  const variableMap = new Map(variables.map((v) => [v.key, v.value]));

  return text.replace(regex, (match, _prefix, key) => {
    if (variableMap.has(key)) {
      return variableMap.get(key) ?? "";
    } else {
      console.log(`Unknown map variable '${key}' in text field`);
      return match;
    }
  });
}
