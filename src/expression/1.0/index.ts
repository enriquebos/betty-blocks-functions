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

const customExpression = async ({
  expression,
  variables,
  debugLogging,
}: ExpressionInput): Promise<unknown> => {
  const parsedVars = variableMap(variables);
  const template = templayed(expression)(parsedVars);
  let functionOutput: string;

  try {
    functionOutput = new Function(`return ${template}`)();
  } catch (error: unknown) {
    const errorMessage = `Error evaluating expression: "${(error as Error).message}" (template: ${template} variables: ${JSON.stringify(parsedVars)})`;

    if (debugLogging) {
      console.error(errorMessage);
    }

    throw new Error(errorMessage);
  }

  return {
    as: functionOutput,
  };
};

export default customExpression;
