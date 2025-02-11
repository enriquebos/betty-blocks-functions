// @ts-ignore
import { Liquid } from "./liquid.min";
import { groupBy } from "remeda";

interface ContextItem {
  key: string;
  value: any;
}

export default function renderLiquidTemplate(
  template: string,
  context: ContextItem[],
): string {
  const engine = new Liquid();

  engine.registerFilter("group", (collection: any[], key: string) =>
    groupBy(collection, (item) => item[key]),
  );

  return engine.parseAndRenderSync(
    template,
    context.reduce<Record<string, any>>((ctx, { key, value }) => {
      ctx[key] = value;
      return ctx;
    }, {}),
  );
}
