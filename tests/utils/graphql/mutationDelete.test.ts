import { mutationDelete } from "../../../src/utils/graphql";
import { gqlRequest, generateRequest } from "../../../src/utils/graphql/utils";
import { RequestMethod, RequestOperation } from "../../../src/utils/graphql/enums";

jest.mock("../../../src/utils/graphql/utils", () => ({
  gqlRequest: jest.fn(),
  generateRequest: jest.fn(),
}));

describe("mutationDelete", () => {
  const mockGenerateRequest = generateRequest as jest.Mock;
  const mockGqlRequest = gqlRequest as jest.Mock;

  const modelName = "User";
  const id = 42;
  const fakeRequestObject = { query: "mock delete request" };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateRequest.mockReturnValue(fakeRequestObject);
  });

  it("should delete the record and return its ID", async () => {
    const responseKey = RequestOperation.Delete + modelName;
    const expectedResponse = { [responseKey]: { id } };
    mockGqlRequest.mockResolvedValue(expectedResponse);

    const result = await mutationDelete(modelName, id);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.Delete,
      { queryArguments: { id } },
      undefined
    );
    expect(mockGqlRequest).toHaveBeenCalledWith(fakeRequestObject);
    expect(result).toBe(id);
  });

  it("should handle _log_request argument", async () => {
    const responseKey = RequestOperation.Delete + modelName;
    mockGqlRequest.mockResolvedValue({ [responseKey]: { id } });

    const result = await mutationDelete(modelName, id, true);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.Delete,
      { queryArguments: { id } },
      true
    );
    expect(result).toBe(id);
  });

  it("should throw if expected response key is missing", async () => {
    mockGqlRequest.mockResolvedValue({});

    await expect(mutationDelete(modelName, id)).rejects.toThrow();
  });
});
