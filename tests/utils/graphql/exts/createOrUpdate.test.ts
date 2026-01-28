import { createOrUpdateRecord } from "../../../../src/utils/graphql/exts/";
import { gqlRequest } from "../../../../src/utils/graphql/utils";

jest.mock("../../../../src/utils/graphql/utils", () => ({
  gqlRequest: jest.fn(),
}));

describe("createOrUpdateRecord", () => {
  const mockedGqlRequest = gqlRequest as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new record", async () => {
    mockedGqlRequest.mockResolvedValueOnce({
      createUser: { id: 1 },
    });

    const input = { name: "John Doe" };
    const result = await createOrUpdateRecord("User", {}, input, true);

    expect(result).toEqual({
      id: 1,
      name: "John Doe",
    });
  });

  it("should update an existing record with numeric id", async () => {
    mockedGqlRequest.mockResolvedValueOnce({
      updateUser: { id: 2 },
    });

    const record = { id: 2 };
    const input = { name: "Jane Smith" };

    const result = await createOrUpdateRecord("User", record, input, false);

    expect(mockedGqlRequest).toHaveBeenCalledWith(expect.any(String), {
      input,
      id: 2,
      validationSets: ["empty"],
    });

    expect(result).toEqual({
      id: 2,
      name: "Jane Smith",
    });
  });

  it("should not pass id if record.id is not a number", async () => {
    mockedGqlRequest.mockResolvedValueOnce({
      updateUser: { id: 3 },
    });

    const record = { id: "not-a-number" };
    const input = { name: "Invalid ID" };

    const result = await createOrUpdateRecord("User", record, input, true);

    expect(mockedGqlRequest).toHaveBeenCalledWith(expect.any(String), {
      input,
      validationSets: ["default"],
    });

    expect(result).toEqual({
      id: 3,
      name: "Invalid ID",
    });
  });

  it("should create a new record when record is null", async () => {
    mockedGqlRequest.mockResolvedValueOnce({
      createUser: { id: 10 },
    });

    const input = { name: "Alice" };
    const result = await createOrUpdateRecord("User", null, input, false);

    expect(mockedGqlRequest).toHaveBeenCalledWith(expect.any(String), {
      input,
      validationSets: ["empty"],
    });

    expect(result).toEqual({
      id: 10,
      name: "Alice",
    });
  });

  it("should update without passing id when record is empty object", async () => {
    mockedGqlRequest.mockResolvedValueOnce({
      updateUser: { id: 123 },
    });

    const record = {};
    const input = { name: "No ID" };

    const result = await createOrUpdateRecord("User", record, input);

    expect(mockedGqlRequest).toHaveBeenCalledWith(expect.any(String), {
      input,
      validationSets: ["empty"],
    });

    expect(result).toEqual({
      id: 123,
      name: "No ID",
    });
  });

  it("should create when both are empty", async () => {
    mockedGqlRequest.mockResolvedValueOnce({
      updateUser: { id: 123 },
    });

    const record = {};
    const input = {};

    const result = await createOrUpdateRecord("User", record, input);

    expect(mockedGqlRequest).toHaveBeenCalledWith(expect.any(String), {
      input,
      validationSets: ["empty"],
    });

    expect(result).toEqual({
      id: 123,
    });
  });

  it("should strip id from input during update to avoid nested id errors", async () => {
    mockedGqlRequest.mockResolvedValueOnce({
      updateUser: { id: 42 },
    });

    const record = { id: 42 };
    const input = { id: 999, name: "Keeps name only" };

    await createOrUpdateRecord("User", record, input, true);

    expect(mockedGqlRequest).toHaveBeenCalledWith(expect.any(String), {
      input: { name: "Keeps name only" },
      id: 42,
      validationSets: ["default"],
    });
  });
});
