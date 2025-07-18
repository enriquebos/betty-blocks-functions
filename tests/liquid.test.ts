import liquid from "../src/liquid/1.0/index";
import renderLiquidTemplate from "../src/utils/liquidjs";

jest.mock("../src/utils/liquidjs");

const mockedRenderLiquidTemplate = renderLiquidTemplate as jest.MockedFunction<
  typeof renderLiquidTemplate
>;

describe("liquid function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return rendered template with provided context", async () => {
    mockedRenderLiquidTemplate.mockReturnValue("Hello, John!");

    const template = "Hello, {{ name }}!";
    const context = [{ key: "name", value: "John" }];
    const result = await liquid({ template, context });

    expect(mockedRenderLiquidTemplate).toHaveBeenCalledWith(template, context);
    expect(result).toEqual({ as: "Hello, John!" });
  });

  it("should handle empty context", async () => {
    mockedRenderLiquidTemplate.mockReturnValue("Hello!");

    const template = "Hello!";
    const result = await liquid({ template });

    expect(mockedRenderLiquidTemplate).toHaveBeenCalledWith(template, []);
    expect(result).toEqual({ as: "Hello!" });
  });

  it("should pass empty array if context is undefined", async () => {
    mockedRenderLiquidTemplate.mockReturnValue("Hi!");

    const template = "Hi!";

    const result = await liquid({ template, context: undefined });

    expect(mockedRenderLiquidTemplate).toHaveBeenCalledWith(template, []);
    expect(result).toEqual({ as: "Hi!" });
  });
});
