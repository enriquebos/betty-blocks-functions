import templayed from "../../utils/templating/templayed";
import { variableMap } from "../../utils";

interface Variable {
  key: string;
  value: string;
}

interface ExpressionInput {
  expression: string;
  variables: Variable[];
  debugLogging: boolean;
}

interface ExpressionResult {
  result: unknown;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage = `Error evaluating expression: "${error.message}" (template: ${template} variables: ${JSON.stringify(parsedVars)})`;

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
