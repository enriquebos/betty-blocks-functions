import { mutationUpsert } from "../../../src/utils/graphql";
import { gqlRequest, generateRequest } from "../../../src/utils/graphql/utils";
import { RequestMethod, RequestOperation } from "../../../src/utils/graphql/enums";

jest.mock("../../../src/utils/graphql/utils", () => ({
  gqlRequest: jest.fn(),
  generateRequest: jest.fn(),
}));

describe("mutationUpsert", () => {
  const mockGenerateRequest = generateRequest as jest.Mock;
  const mockGqlRequest = gqlRequest as jest.Mock;

  const modelName = "User";
  const record = { email: "alice@example.com", name: "Alice" };
  const uniqueBy = ["email"];
  const fakeRequestObject = { query: "mock upsert request" };
  const id = 99;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateRequest.mockReturnValue(fakeRequestObject);
  });

  it("should upsert the record and return its ID", async () => {
    const responseKey = RequestOperation.Upsert + modelName;
    mockGqlRequest.mockResolvedValue({ [responseKey]: { id } });

    const result = await mutationUpsert(modelName, record, uniqueBy);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.Upsert,
      {
        queryArguments: {
          input: record,
          uniqueBy,
        },
      },
      undefined,
    );
    expect(mockGqlRequest).toHaveBeenCalledWith(fakeRequestObject);
    expect(result).toBe(id);
  });

  it("should handle _log_request argument", async () => {
    const responseKey = RequestOperation.Upsert + modelName;
    mockGqlRequest.mockResolvedValue({ [responseKey]: { id } });

    const result = await mutationUpsert(modelName, record, uniqueBy, true);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.Upsert,
      {
        queryArguments: {
          input: record,
          uniqueBy,
        },
      },
      true,
    );
    expect(result).toBe(id);
  });

  it("should throw if expected response key is missing", async () => {
    mockGqlRequest.mockResolvedValue({});

    await expect(mutationUpsert(modelName, record, uniqueBy)).rejects.toThrow();
  });
});
