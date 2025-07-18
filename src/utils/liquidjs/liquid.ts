// @ts-expect-error: Could not find a declaration file for module './liquid.min'
import { Liquid } from "./liquid.min";
import { groupBy } from "remeda";

interface ContextItem {
  key: string;
  value: unknown;
}

export default function renderLiquidTemplate(template: string, context: ContextItem[]): string {
  if (template.length === 0) {
    return template;
  }

  const engine = new Liquid();

  engine.registerFilter("group", (collection: never[], key: string) =>
    groupBy(collection, (item) => item[key]),
  );

  return engine.parseAndRenderSync(
    template,
    context.reduce<Record<string, unknown>>((ctx, { key, value }) => {
      try {
        ctx[key] = JSON.parse(value as string);
      } catch {
        ctx[key] = value;
      }
      return ctx;
    }, {}),
  );
}
