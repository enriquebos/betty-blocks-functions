import {
  mutationCreate,
  mutationDelete,
  mutationUpdate,
  mutationUpsert,
  mutationCreateMany,
  mutationDeleteMany,
  mutationUpdateMany,
  mutationUpsertMany,
  queryOne,
  queryAll,
} from "../../../../src/utils/graphql";

import { modelCount, GraphqlModel } from "../../../../src/utils/graphql/exts";

jest.mock("../../../../src/utils/graphql", () => ({
  mutationCreate: jest.fn(),
  mutationDelete: jest.fn(),
  mutationUpdate: jest.fn(),
  mutationUpsert: jest.fn(),
  mutationCreateMany: jest.fn(),
  mutationDeleteMany: jest.fn(),
  mutationUpdateMany: jest.fn(),
  mutationUpsertMany: jest.fn(),
  queryOne: jest.fn(),
  queryAll: jest.fn(),
}));

jest.spyOn(require("../../../../src/utils/graphql/exts"), "modelCount").mockImplementation(jest.fn());

describe("GraphqlModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("queryOne calls queryOne with correct arguments and returns result", async () => {
    const fakeResult = { id: 1, name: "Test" };
    (queryOne as jest.Mock).mockResolvedValue(fakeResult);

    const model = new GraphqlModel("TestModel");
    const fields = { id: Boolean, name: String };

    const result = await model.queryOne<typeof fakeResult>({ fields, queryArguments: { where: { id: 1 } } });

    expect(queryOne).toHaveBeenCalledWith("TestModel", {
      fields,
      queryArguments: { where: { id: 1 } },
    });
    expect(result).toEqual(fakeResult);
  });

  it("queryAll calls queryAll with correct arguments and returns result", async () => {
    const fakeResponse = { totalCount: 10, data: [{ id: 1 }] };
    (queryAll as jest.Mock).mockResolvedValue(fakeResponse);

    const model = new GraphqlModel("TestModel", false, true);
    const fields = { id: Boolean };

    const result = await model.queryAll<{ id: number }>({ fields, queryArguments: { take: 5 } });

    expect(queryAll).toHaveBeenCalledWith("TestModel", {
      fields,
      queryArguments: { take: 5 },
    });
    expect(result).toEqual(fakeResponse);
  });

  it("modelCount calls modelCount with correct arguments and returns result", async () => {
    (modelCount as jest.Mock).mockResolvedValue(7);

    const model = new GraphqlModel("TestModel");
    const count = await model.modelCount({ active: true });

    expect(modelCount).toHaveBeenCalledWith("TestModel", { active: true });
    expect(count).toBe(7);
  });

  it("mutationCreate calls mutationCreate with correct arguments and returns result", async () => {
    (mutationCreate as jest.Mock).mockResolvedValue(42);

    const model = new GraphqlModel("TestModel");
    const record = { name: "New record" };

    const result = await model.mutationCreate(record);

    expect(mutationCreate).toHaveBeenCalledWith("TestModel", record);
    expect(result).toBe(42);
  });

  it("mutationDelete calls mutationDelete with correct arguments and returns result", async () => {
    (mutationDelete as jest.Mock).mockResolvedValue(1);

    const model = new GraphqlModel("TestModel", false, true);

    const result = await model.mutationDelete(10);

    expect(mutationDelete).toHaveBeenCalledWith("TestModel", 10, true);
    expect(result).toBe(1);
  });

  it("mutationUpdate calls mutationUpdate with correct arguments and returns result", async () => {
    (mutationUpdate as jest.Mock).mockResolvedValue(1);

    const model = new GraphqlModel("TestModel", false, true);
    const partialRecord = { name: "Updated" };

    const result = await model.mutationUpdate(10, partialRecord);

    expect(mutationUpdate).toHaveBeenCalledWith("TestModel", 10, partialRecord, true);
    expect(result).toBe(1);
  });

  it("mutationUpsert calls mutationUpsert with correct arguments and returns result", async () => {
    (mutationUpsert as jest.Mock).mockResolvedValue(1);

    const model = new GraphqlModel("TestModel", false, true);
    const record = { id: 1, name: "Upserted" };
    const uniqueBy = ["id"];

    const result = await model.mutationUpsert(record, uniqueBy);

    expect(mutationUpsert).toHaveBeenCalledWith("TestModel", record, uniqueBy, true);
    expect(result).toBe(1);
  });

  it("mutationCreateMany calls mutationCreateMany with correct arguments and returns result", async () => {
    const resultIds = [1, 2];
    (mutationCreateMany as jest.Mock).mockResolvedValue(resultIds);

    const model = new GraphqlModel("TestModel", false, true);
    const records = [{ name: "A" }, { name: "B" }];

    const result = await model.mutationCreateMany(records);

    expect(mutationCreateMany).toHaveBeenCalledWith("TestModel", records, true);
    expect(result).toEqual(resultIds);
  });

  it("mutationDeleteMany calls mutationDeleteMany with correct arguments and returns result", async () => {
    const resultIds = [1, 2];
    (mutationDeleteMany as jest.Mock).mockResolvedValue(resultIds);

    const model = new GraphqlModel("TestModel", false, true);
    const ids = [5, 6];

    const result = await model.mutationDeleteMany(ids);

    expect(mutationDeleteMany).toHaveBeenCalledWith("TestModel", ids, true);
    expect(result).toEqual(resultIds);
  });

  it("mutationUpdateMany calls mutationUpdateMany with correct arguments and returns result", async () => {
    const resultIds = [1, 2];
    (mutationUpdateMany as jest.Mock).mockResolvedValue(resultIds);

    const model = new GraphqlModel("TestModel", false, true);
    const partialRecord = { status: "active" };
    const where = { age: { gt: 18 } };

    const result = await model.mutationUpdateMany(partialRecord, where);

    expect(mutationUpdateMany).toHaveBeenCalledWith("TestModel", partialRecord, {
      where,
      _log_request: true,
    });
    expect(result).toEqual(resultIds);
  });

  it("mutationUpsertMany calls mutationUpsertMany with correct arguments and returns result", async () => {
    const resultIds = [1, 2];
    (mutationUpsertMany as jest.Mock).mockResolvedValue(resultIds);

    const model = new GraphqlModel("TestModel", false, true);
    const records = [{ id: 1 }, { id: 2 }];

    const result = await model.mutationUpsertMany(records);

    expect(mutationUpsertMany).toHaveBeenCalledWith("TestModel", records, true);
    expect(result).toEqual(resultIds);
  });
});
