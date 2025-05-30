import { mutationDeleteMany } from "../../../src/utils/graphql";
import { gqlRequest, generateRequest } from "../../../src/utils/graphql/utils";
import { RequestMethod, RequestOperation } from "../../../src/utils/graphql/enums";

jest.mock("../../../src/utils/graphql/utils", () => ({
  gqlRequest: jest.fn(),
  generateRequest: jest.fn(),
}));

describe("mutationDeleteMany", () => {
  const mockGenerateRequest = generateRequest as jest.Mock;
  const mockGqlRequest = gqlRequest as jest.Mock;

  const modelName = "User";
  const ids = [1, 2, 3];
  const fakeRequestObject = { query: "mock delete many request" };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateRequest.mockReturnValue(fakeRequestObject);
  });

  it("should return array of IDs on successful deletion", async () => {
    const responseKey = RequestOperation.DeleteMany + modelName;
    const expectedResponse = {
      [responseKey]: [{ id: 1 }, { id: 2 }, { id: 3 }],
    };
    mockGqlRequest.mockResolvedValue(expectedResponse);

    const result = await mutationDeleteMany(modelName, ids);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.DeleteMany,
      { queryArguments: { input: { ids } } },
      undefined,
    );
    expect(mockGqlRequest).toHaveBeenCalledWith(fakeRequestObject);
    expect(result).toEqual(ids);
  });

  it("should return empty array if ids input is empty", async () => {
    const result = await mutationDeleteMany(modelName, []);
    expect(result).toEqual([]);
    expect(mockGenerateRequest).not.toHaveBeenCalled();
    expect(mockGqlRequest).not.toHaveBeenCalled();
  });

  it("should handle _log_request argument", async () => {
    const responseKey = RequestOperation.DeleteMany + modelName;
    mockGqlRequest.mockResolvedValue({
      [responseKey]: [{ id: 42 }],
    });

    const result = await mutationDeleteMany(modelName, [42], true);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.DeleteMany,
      { queryArguments: { input: { ids: [42] } } },
      true,
    );
    expect(result).toEqual([42]);
  });

  it("should throw if expected response key is missing", async () => {
    mockGqlRequest.mockResolvedValue({});

    await expect(mutationDeleteMany(modelName, ids)).rejects.toThrow();
  });
});
