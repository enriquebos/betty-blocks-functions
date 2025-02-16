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
}: ExpressionInput): Promise<ExpressionResult> => {
  const parsedVars = variableMap(variables);
  const template = templayed(expression)(parsedVars);
  let functionOutput;

  try {
    functionOutput = new Function(`return ${template}`)();
  } catch (error) {
    const errorMessage = `Error evaluating expression: "${error.message}" (template: ${template} variables: ${JSON.stringify(parsedVars)})`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return {
    result: functionOutput,
  };
};

export default customExpression;
