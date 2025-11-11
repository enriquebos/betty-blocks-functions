import deleteAll from "../src/delete-all/1.0";
import { replaceTemplateVariables } from "../src/utils/templating";
import { whereToObject } from "../src/utils/graphql/utils";
import { deleteWhere } from "../src/utils/graphql/exts";

jest.mock("../src/utils/graphql/exts", () => ({
  deleteWhere: jest.fn(),
}));

jest.mock("../src/utils/templating", () => ({
  replaceTemplateVariables: jest.fn(),
}));

jest.mock("../src/utils/graphql/utils", () => ({
  whereToObject: jest.fn(),
}));

describe("deleteAll", () => {
  const mockModel = { name: "TestModel" };
  const mockFilter = "some filter";
  const mockFilterVars = [
    {
      key: [{ kind: "Variable", name: "var1" }],
      value: "value1",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (replaceTemplateVariables as jest.Mock).mockReturnValue("processedFilter");
    (whereToObject as jest.Mock).mockReturnValue({ some: "condition" });
  });

  it("throws if amountToDelete is 0 or negative", async () => {
    await expect(
      deleteAll({
        model: mockModel,
        amountToDelete: 0,
        batchSize: 10,
        filter: mockFilter,
        filterVars: mockFilterVars,
      }),
    ).rejects.toThrow("Delete amount cannot be lower than or equal to 0");
  });

  it("throws if batchSize is 0 or negative", async () => {
    await expect(
      deleteAll({
        model: mockModel,
        amountToDelete: 10,
        batchSize: 0,
        filter: mockFilter,
        filterVars: mockFilterVars,
      }),
    ).rejects.toThrow("Batch size cannot be lower than or equal to 0");
  });

  it("queries and deletes records in batches", async () => {
    (deleteWhere as jest.Mock).mockResolvedValue(["id-0", "id-1", "id-2", "id-3", "id-4"]);

    const result = await deleteAll({
      model: mockModel,
      amountToDelete: 5,
      batchSize: 3,
      filter: mockFilter,
      filterVars: mockFilterVars,
    });

    expect(replaceTemplateVariables).toHaveBeenCalledWith(mockFilter, mockFilterVars);
    expect(whereToObject).toHaveBeenCalledWith("processedFilter");

    expect(deleteWhere).toHaveBeenCalledWith("TestModel", {
      amountToDelete: 5,
      batchSize: 3,
      where: { some: "condition" },
    });

    expect(result).toEqual({
      as: "5 records from TestModel have been deleted",
    });
  });

  it("stops early if fewer records are returned than batch size", async () => {
    (deleteWhere as jest.Mock).mockResolvedValue(["id-1", "id-2"]);

    const result = await deleteAll({
      model: mockModel,
      amountToDelete: 10,
      batchSize: 5,
      filter: mockFilter,
      filterVars: mockFilterVars,
    });

    expect(deleteWhere).toHaveBeenCalledWith("TestModel", {
      amountToDelete: 10,
      batchSize: 5,
      where: { some: "condition" },
    });
    expect(result).toEqual({
      as: "2 records from TestModel have been deleted",
    });
  });
});
