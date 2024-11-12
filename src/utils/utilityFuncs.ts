export function* chunkArray<T>(
  array: T[],
  chunkSize: number,
): Generator<T[], void, unknown> {
  for (let i = 0; i < array.length; i += chunkSize)
    yield array.slice(i, i + chunkSize);
}

export function formatStringMap(
  text: string,
  map: { key: string; value: string }[],
): string {
  const regex = /\{\{(!|&|\{)?\s*(.*?)\s*}}+/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    try {
      const key = match[2];
      const replacement = map.find((e) => e.key === key)?.value;

      if (replacement !== undefined) {
        text = text.replaceAll(match[0], replacement);
      } else {
        console.log(`Unknown map variable '${key}' in text field`);
      }
    } catch (TypeError) {
      console.log("Unknown map variable in text field");
    }
  }

  return text;
}
