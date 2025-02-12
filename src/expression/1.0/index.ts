import templayed from "../../utils/templayed";
import { variableMap } from "../../utils/utilityFuncs";

interface Variable {
  key: string;
  value: string;
}

interface ExpressionInput {
  expression: string;
  variables: Variable[];
}

interface ExpressionResult {
  result: any;
}

const customExpression = async ({
  expression,
  variables,
}: ExpressionInput): Promise<ExpressionResult> => ({
  result: new Function(
    `return ${templayed(expression)(variableMap(variables))}`,
  )(),
});

export default customExpression;
