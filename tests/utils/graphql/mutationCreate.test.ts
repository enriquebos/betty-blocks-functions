import { mutationCreate } from "../../../src/utils/graphql";
import { gqlRequest, generateRequest } from "../../../src/utils/graphql/utils";
import { RequestOperation, RequestMethod } from "../../../src/utils/graphql/enums";

jest.mock("../../../src/utils/graphql/utils", () => ({
  gqlRequest: jest.fn(),
  generateRequest: jest.fn(),
}));

describe("mutationCreate", () => {
  const mockGenerateRequest = generateRequest as jest.Mock;
  const mockGqlRequest = gqlRequest as jest.Mock;

  const modelName = "User";
  const input = { name: "John", email: "john@example.com" };
  const fakeRequestObject = { fake: "query" };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateRequest.mockReturnValue(fakeRequestObject);
  });

  it("should call generateRequest and gqlRequest with correct arguments", async () => {
    const expectedResponse = { createUser: { id: 123 } };
    mockGqlRequest.mockResolvedValue(expectedResponse);

    const result = await mutationCreate(modelName, input);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.Create,
      { queryArguments: { input } },
      undefined,
    );

    expect(mockGqlRequest).toHaveBeenCalledWith(fakeRequestObject);
    expect(result).toBe(123);
  });

  it("should handle _log_request argument", async () => {
    mockGqlRequest.mockResolvedValue({ createUser: { id: 456 } });

    const result = await mutationCreate(modelName, input, true);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.Create,
      { queryArguments: { input } },
      true,
    );

    expect(result).toBe(456);
  });

  it("should throw if gqlRequest response is missing expected key", async () => {
    mockGqlRequest.mockResolvedValue({});

    await expect(mutationCreate(modelName, input)).rejects.toThrow();
  });
});
