import renderLiquidTemplate from "../../utils/liquidjs";

interface ContextItem {
  key: string;
  value: unknown;
}

interface LiquidParams {
  template: string;
  context?: ContextItem[];
}

const liquid = async ({ template, context = [] }: LiquidParams): Promise<{ as: string }> => ({
  as: renderLiquidTemplate(template, context),
});

export default liquid;
