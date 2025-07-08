import { mutationUpdate } from "../../../src/utils/graphql";
import { gqlRequest, generateRequest } from "../../../src/utils/graphql/utils";
import { RequestMethod, RequestOperation } from "../../../src/utils/graphql/enums";

jest.mock("../../../src/utils/graphql/utils", () => ({
  gqlRequest: jest.fn(),
  generateRequest: jest.fn(),
}));

describe("mutationUpdate", () => {
  const mockGenerateRequest = generateRequest as jest.Mock;
  const mockGqlRequest = gqlRequest as jest.Mock;

  const modelName = "User";
  const id = 123;
  const partialRecord = { name: "Updated Name" };
  const fakeRequestObject = { query: "mock update request" };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateRequest.mockReturnValue(fakeRequestObject);
  });

  it("should update the record and return its ID", async () => {
    const responseKey = RequestOperation.Update + modelName;
    mockGqlRequest.mockResolvedValue({ [responseKey]: { id } });

    const result = await mutationUpdate(modelName, id, partialRecord);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.Update,
      { queryArguments: { id, input: partialRecord } },
      undefined,
    );
    expect(mockGqlRequest).toHaveBeenCalledWith(fakeRequestObject);
    expect(result).toBe(id);
  });

  it("should handle _log_request argument", async () => {
    const responseKey = RequestOperation.Update + modelName;
    mockGqlRequest.mockResolvedValue({ [responseKey]: { id } });

    const result = await mutationUpdate(modelName, id, partialRecord, true);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.Update,
      { queryArguments: { id, input: partialRecord } },
      true,
    );
    expect(result).toBe(id);
  });

  it("should throw if expected response key is missing", async () => {
    mockGqlRequest.mockResolvedValue({});

    await expect(mutationUpdate(modelName, id, partialRecord)).rejects.toThrow();
  });
});
