import templayed from "../../utils/templayed";
import { variableMap } from "../../utils/utilityFuncs";

interface Variable {
  key: string;
  value: string;
}

interface ExpressionInput {
  expression: string;
  variables: Variable[];
  debugLogging: Boolean;
}

interface ExpressionResult {
  result: any;
}

const customExpression = async ({
  expression,
  variables,
  debugLogging,
}: ExpressionInput): Promise<ExpressionResult> => {
  const parsedVars = variableMap(variables);
  const template: string = templayed(expression)(parsedVars);
  let functionOutput: string;

  try {
    functionOutput = new Function(`return ${template}`)();
  } catch (error) {
    const errorMessage: string = `Error evaluating expression: "${error.message}" (template: ${template} variables: ${JSON.stringify(parsedVars)})`;

    if (debugLogging) {
      console.error(errorMessage);
    }

    throw new Error(errorMessage);
  }

  return {
    result: functionOutput,
  };
};

export default customExpression;
