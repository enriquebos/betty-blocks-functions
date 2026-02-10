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
    (deleteWhere as jest.Mock).mockRejectedValueOnce(
      new Error("Delete amount cannot be lower than or equal to 0"),
    );

    await expect(
      deleteAll({
        model: mockModel,
        amountToDelete: 0,
        batchSize: 10,
        filter: mockFilter,
        filterVars: mockFilterVars,
      }),
    ).rejects.toThrow("Delete amount cannot be lower than or equal to 0");

    expect(deleteWhere).toHaveBeenCalledWith("TestModel", {
      amountToDelete: 0,
      batchSize: 10,
      where: { some: "condition" },
    });
  });

  it("throws if batchSize is 0 or negative", async () => {
    (deleteWhere as jest.Mock).mockRejectedValueOnce(
      new Error("Batch size cannot be lower than or equal to 0"),
    );

    await expect(
      deleteAll({
        model: mockModel,
        amountToDelete: 10,
        batchSize: 0,
        filter: mockFilter,
        filterVars: mockFilterVars,
      }),
    ).rejects.toThrow("Batch size cannot be lower than or equal to 0");

    expect(deleteWhere).toHaveBeenCalledWith("TestModel", {
      amountToDelete: 10,
      batchSize: 0,
      where: { some: "condition" },
    });
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

    expect(replaceTemplateVariables).toHaveBeenCalledWith(mockFilter, [
      { key: "var1", value: "value1" },
    ]);
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

  it("maps filter vars defensively when key names or values are missing", async () => {
    (deleteWhere as jest.Mock).mockResolvedValue(["id-1"]);

    await deleteAll({
      model: mockModel,
      amountToDelete: 1,
      batchSize: 1,
      filter: mockFilter,
      filterVars: [
        { key: [], value: "ignored" } as unknown as (typeof mockFilterVars)[number],
        { key: [{ kind: "Variable", name: "active" }], value: null },
      ],
    });

    expect(replaceTemplateVariables).toHaveBeenCalledWith(mockFilter, [{ key: "active", value: "" }]);
  });

  it("uses empty template vars when filterVars is undefined", async () => {
    (deleteWhere as jest.Mock).mockResolvedValue([]);

    await deleteAll({
      model: mockModel,
      amountToDelete: 1,
      batchSize: 1,
      filter: mockFilter,
      filterVars: undefined,
    });

    expect(replaceTemplateVariables).toHaveBeenCalledWith(mockFilter, []);
  });
});
