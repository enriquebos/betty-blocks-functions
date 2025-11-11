import deleteWhere from "../../../../src/utils/graphql/exts/deleteWhere";
import { queryAll, mutationDeleteMany } from "../../../../src/utils/graphql";

jest.mock("../../../../src/utils/graphql", () => ({
  queryAll: jest.fn(),
  mutationDeleteMany: jest.fn(),
}));

describe("deleteWhere ext", () => {
  const modelName = "TestModel";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deletes records in batches and stops when final batch is smaller", async () => {
    (queryAll as jest.Mock)
      .mockResolvedValueOnce({
        data: Array.from({ length: 3 }, (_, i) => ({ id: i + 1 })),
      })
      .mockResolvedValueOnce({
        data: [{ id: 4 }],
      });

    const ids = await deleteWhere(modelName, {
      amountToDelete: 4,
      batchSize: 3,
      where: { active: true },
    });

    expect(queryAll).toHaveBeenNthCalledWith(1, modelName, {
      queryArguments: { skip: 0, take: 4, where: { active: true } },
      _log_request: undefined,
    });
    expect(queryAll).toHaveBeenNthCalledWith(2, modelName, {
      queryArguments: { skip: 3, take: 1, where: { active: true } },
      _log_request: undefined,
    });
    expect(mutationDeleteMany).toHaveBeenCalledWith(modelName, [1, 2, 3, 4]);
    expect(ids).toEqual([1, 2, 3, 4]);
  });

  it("respects maxTake when batch size exceeds limit", async () => {
    (queryAll as jest.Mock).mockResolvedValueOnce({
      data: Array.from({ length: 5 }, (_, i) => ({ id: i + 1 })),
    });

    await deleteWhere(modelName, {
      amountToDelete: 5000,
      batchSize: 6000,
      where: {},
    });

    expect(queryAll).toHaveBeenCalledWith(modelName, {
      queryArguments: { skip: 0, take: 5000, where: {} },
      _log_request: undefined,
    });
  });

  it("returns empty array when inputs are invalid", async () => {
    const ids = await deleteWhere(modelName, {
      amountToDelete: 0,
      batchSize: -1,
    });

    expect(ids).toEqual([]);
    expect(queryAll).not.toHaveBeenCalled();
    expect(mutationDeleteMany).not.toHaveBeenCalled();
  });

  it("allows overriding maxTake", async () => {
    (queryAll as jest.Mock).mockResolvedValueOnce({
      data: [{ id: 1 }],
    });

    await deleteWhere(modelName, {
      amountToDelete: 10,
      batchSize: 10,
      where: {},
      maxTake: 100,
    });

    expect(queryAll).toHaveBeenCalledWith(modelName, {
      queryArguments: { skip: 0, take: 10, where: {} },
      _log_request: undefined,
    });
  });

  it("stops iterating once remaining drops to zero before querying again", async () => {
    (queryAll as jest.Mock)
      .mockResolvedValueOnce({ data: [{ id: 1 }, { id: 2 }] })
      .mockResolvedValueOnce({ data: [{ id: 3 }, { id: 4 }] });

    const ids = await deleteWhere(modelName, {
      amountToDelete: 4,
      batchSize: 2,
    });

    expect(queryAll).toHaveBeenCalledTimes(2); // third iteration breaks before calling queryAll
    expect(ids).toEqual([1, 2, 3, 4]);
  });

  it("short-circuits when maxTake forces a zero-sized batch", async () => {
    const ids = await deleteWhere(modelName, {
      amountToDelete: 5,
      batchSize: 5,
      maxTake: 0,
    });

    expect(ids).toEqual([]);
    expect(queryAll).not.toHaveBeenCalled();
    expect(mutationDeleteMany).not.toHaveBeenCalled();
  });

  it("breaks when query returns no data", async () => {
    (queryAll as jest.Mock).mockResolvedValueOnce({ data: [] });

    const ids = await deleteWhere(modelName, {
      amountToDelete: 5,
      batchSize: 5,
    });

    expect(ids).toEqual([]);
    expect(queryAll).toHaveBeenCalledTimes(1);
    expect(mutationDeleteMany).not.toHaveBeenCalled();
  });
});
