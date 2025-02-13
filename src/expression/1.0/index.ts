import templayed from "../../utils/templayed";
import { variableMap } from "../../utils/utilityFuncs";

interface Variable {
  key: string;
  value: string;
}

interface ExpressionInput {
  expression: string;
  variables: Variable[];
  debug: Boolean;
  logError: Boolean;
}

interface ExpressionResult {
  result: any;
}

const customExpression = async ({
  expression,
  variables,
  debug,
  logError,
}: ExpressionInput): Promise<ExpressionResult> => {
  const parsedVars = variableMap(variables);
  const template = templayed(expression)(parsedVars);
  const templateFunction = new Function(`return ${template}`);

  if (debug) {
    console.log({
      template: template,
      variables: parsedVars,
    });
  }
  if (logError) {
    throw new Error(`{ template: ${template}, variables: ${parsedVars} }`);
  }

  return {
    result: templateFunction(),
  };
};

export default customExpression;
