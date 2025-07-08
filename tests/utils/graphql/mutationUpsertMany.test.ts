import { mutationUpsertMany } from "../../../src/utils/graphql";
import { gqlRequest, generateRequest } from "../../../src/utils/graphql/utils";
import { RequestMethod, RequestOperation } from "../../../src/utils/graphql/enums";

jest.mock("../../../src/utils/graphql/utils", () => ({
  gqlRequest: jest.fn(),
  generateRequest: jest.fn(),
}));

describe("mutationUpsertMany", () => {
  const mockGenerateRequest = generateRequest as jest.Mock;
  const mockGqlRequest = gqlRequest as jest.Mock;

  const modelName = "User";
  const records = [{ email: "a@example.com" }, { email: "b@example.com" }];
  const fakeRequestObject = { query: "mock upsert many request" };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateRequest.mockReturnValue(fakeRequestObject);
  });

  it("should return array of IDs on successful upsert", async () => {
    const responseKey = RequestOperation.UpsertMany + modelName;
    const expectedResponse = {
      [responseKey]: [{ id: 1 }, { id: 2 }],
    };
    mockGqlRequest.mockResolvedValue(expectedResponse);

    const result = await mutationUpsertMany(modelName, records);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.UpsertMany,
      { queryArguments: { input: records } },
      undefined,
    );
    expect(mockGqlRequest).toHaveBeenCalledWith(fakeRequestObject);
    expect(result).toEqual([1, 2]);
  });

  it("should return empty array if records input is empty", async () => {
    const result = await mutationUpsertMany(modelName, []);
    expect(result).toEqual([]);
    expect(mockGenerateRequest).not.toHaveBeenCalled();
    expect(mockGqlRequest).not.toHaveBeenCalled();
  });

  it("should handle _log_request argument", async () => {
    const responseKey = RequestOperation.UpsertMany + modelName;
    mockGqlRequest.mockResolvedValue({
      [responseKey]: [{ id: 42 }],
    });

    const result = await mutationUpsertMany(modelName, [{ email: "c@example.com" }], true);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.UpsertMany,
      { queryArguments: { input: [{ email: "c@example.com" }] } },
      true,
    );
    expect(result).toEqual([42]);
  });

  it("should throw if expected response key is missing", async () => {
    mockGqlRequest.mockResolvedValue({});

    await expect(mutationUpsertMany(modelName, records)).rejects.toThrow();
  });
});
