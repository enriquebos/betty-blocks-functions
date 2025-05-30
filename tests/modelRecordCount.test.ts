import modelRecordCount from "../src/model-record-count/1.0";
import { modelCount } from "../src/utils/graphql/exts";
import { whereToObject } from "../src/utils/graphql/utils";
import { formatStringMap } from "../src/utils/utilityFuncs";

jest.mock("../src/utils/graphql/exts", () => ({
  modelCount: jest.fn(),
}));
jest.mock("../src/utils/graphql/utils", () => ({
  whereToObject: jest.fn(),
}));
jest.mock("../src/utils/utilityFuncs", () => ({
  formatStringMap: jest.fn(),
}));

describe("modelRecordCount", () => {
  it("should transform filters and call modelCount with correct arguments", async () => {
    const mockFilter = "field = $value";
    const mockFilterVars = [{ key: "value", value: "123" }];

    const formattedFilter = "field = 123";
    const whereObject = { field: "123" };
    const mockCountResult = 42;

    (formatStringMap as jest.Mock).mockReturnValue(formattedFilter);
    (whereToObject as jest.Mock).mockReturnValue(whereObject);
    (modelCount as jest.Mock).mockResolvedValue(mockCountResult);

    const result = await modelRecordCount({
      model: { name: "TestModel" },
      filter: mockFilter,
      filterVars: mockFilterVars,
    });

    expect(formatStringMap).toHaveBeenCalledWith(mockFilter, mockFilterVars);
    expect(whereToObject).toHaveBeenCalledWith(formattedFilter);
    expect(modelCount).toHaveBeenCalledWith("TestModel", { where: whereObject });
    expect(result).toEqual({ result: mockCountResult });
  });

  it("should handle missing filter and filterVars gracefully", async () => {
    (modelCount as jest.Mock).mockResolvedValue(0);
    (formatStringMap as jest.Mock).mockReturnValue(undefined);
    (whereToObject as jest.Mock).mockReturnValue({});

    const result = await modelRecordCount({
      model: { name: "EmptyModel" },
    });

    expect(formatStringMap).toHaveBeenCalledWith(undefined, undefined);
    expect(whereToObject).toHaveBeenCalledWith(undefined);
    expect(modelCount).toHaveBeenCalledWith("EmptyModel", { where: {} });
    expect(result).toEqual({ result: 0 });
  });
});
