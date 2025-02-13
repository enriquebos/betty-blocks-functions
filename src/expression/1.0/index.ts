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
      expression: template,
      variables: JSON.stringify(parsedVars),
    });
  }
  if (logError) {
    throw new Error(
      `{ expression: ${template}, variables: ${JSON.stringify(parsedVars)} }`,
    );
  }

  return {
    result: templateFunction(),
  };
};

export default customExpression;
