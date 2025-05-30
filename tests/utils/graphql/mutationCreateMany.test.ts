import { mutationCreateMany } from "../../../src/utils/graphql";
import { gqlRequest, generateRequest } from "../../../src/utils/graphql/utils";
import { RequestMethod, RequestOperation } from "../../../src/utils/graphql/enums";

jest.mock("../../../src/utils/graphql/utils", () => ({
  gqlRequest: jest.fn(),
  generateRequest: jest.fn(),
}));

describe("mutationCreateMany", () => {
  const mockGenerateRequest = generateRequest as jest.Mock;
  const mockGqlRequest = gqlRequest as jest.Mock;

  const modelName = "User";
  const inputRecords = [
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob", email: "bob@example.com" },
  ];
  const fakeRequestObject = { query: "mocked query" };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateRequest.mockReturnValue(fakeRequestObject);
  });

  it("should return array of IDs on success", async () => {
    const responseKey = RequestOperation.CreateMany + modelName;
    const expectedResponse = {
      [responseKey]: [{ id: 1 }, { id: 2 }],
    };
    mockGqlRequest.mockResolvedValue(expectedResponse);

    const result = await mutationCreateMany(modelName, inputRecords);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.CreateMany,
      { queryArguments: { input: inputRecords } },
      undefined
    );
    expect(mockGqlRequest).toHaveBeenCalledWith(fakeRequestObject);
    expect(result).toEqual([1, 2]);
  });

  it("should return an empty array if records input is empty", async () => {
    const result = await mutationCreateMany(modelName, []);
    expect(result).toEqual([]);
    expect(mockGenerateRequest).not.toHaveBeenCalled();
    expect(mockGqlRequest).not.toHaveBeenCalled();
  });

  it("should handle _log_request argument", async () => {
    const responseKey = RequestOperation.CreateMany + modelName;
    mockGqlRequest.mockResolvedValue({
      [responseKey]: [{ id: 10 }],
    });

    const result = await mutationCreateMany(modelName, [inputRecords[0]], true);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.CreateMany,
      { queryArguments: { input: [inputRecords[0]] } },
      true
    );
    expect(result).toEqual([10]);
  });

  it("should throw if expected response key is missing", async () => {
    mockGqlRequest.mockResolvedValue({});

    await expect(mutationCreateMany(modelName, inputRecords)).rejects.toThrow();
  });
});
