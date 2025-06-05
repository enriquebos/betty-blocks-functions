import customExpression from "../src/expression/1.0/index";
import { templayed } from "../src/utils/templating";
import { variableMap } from "../src/utils/";

jest.mock("../src/utils/templating");
jest.mock("../src/utils/", () => ({
  variableMap: jest.fn(),
}));

describe("customExpression", () => {
  const mockTemplayed = templayed as jest.Mock;
  const mockVariableMap = variableMap as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should evaluate a valid expression with variables", async () => {
    const expression = "{{x}} + {{y}}";
    const variables = [
      { key: "x", value: "2" },
      { key: "y", value: "3" },
    ];

    mockVariableMap.mockReturnValue({ x: "2", y: "3" });
    mockTemplayed.mockImplementation(() => (vars: object & { x: string; y: string }) => `${vars.x} + ${vars.y}`);

    const result = await customExpression({ expression, variables, debugLogging: false });

    expect(result).toEqual({ result: 5 });
    expect(mockVariableMap).toHaveBeenCalledWith(variables);
  });

  it("should handle errors and log when debugLogging is true", async () => {
    const expression = "{{x}} +";
    const variables = [{ key: "x", value: "2" }];

    mockVariableMap.mockReturnValue({ x: "2" });
    mockTemplayed.mockImplementation(() => () => `2 +`);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(customExpression({ expression, variables, debugLogging: true })).rejects.toThrow(
      /Error evaluating expression/
    );

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Error evaluating expression"));
    consoleSpy.mockRestore();
  });

  it("should throw an error without logging when debugLogging is false", async () => {
    const expression = "{{x}} +";
    const variables = [{ key: "x", value: "2" }];

    mockVariableMap.mockReturnValue({ x: "2" });
    mockTemplayed.mockImplementation(() => () => `2 +`);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(customExpression({ expression, variables, debugLogging: false })).rejects.toThrow(
      /Error evaluating expression/
    );

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
