// @ts-ignore
import { Liquid } from "../../utils/liquid.min";
import { groupBy } from "remeda";

interface ContextItem {
  key: string;
  value: any;
}

interface LiquidParams {
  template: string;
  context?: ContextItem[];
}

const liquid = async ({
  template,
  context = [],
}: LiquidParams): Promise<{ as: string }> => {
  const engine = new Liquid();

  engine.registerFilter("group", (collection: any[], key: string) =>
    groupBy(collection, (item) => item[key]),
  );

  const as = engine.parseAndRenderSync(
    template,
    context.reduce<Record<string, any>>((ctx, { key, value }) => {
      ctx[key] = value;
      return ctx;
    }, {}),
  );

  return { as };
};

export default liquid;
