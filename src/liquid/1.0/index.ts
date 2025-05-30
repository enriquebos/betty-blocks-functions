import renderLiquidTemplate from "../../utils/liquid";

interface ContextItem {
  key: string;
  value: any;
}

interface LiquidParams {
  template: string;
  context?: ContextItem[];
}

const liquid = async ({ template, context = [] }: LiquidParams): Promise<{ as: string }> => ({
  as: renderLiquidTemplate(template, context),
});

export default liquid;
