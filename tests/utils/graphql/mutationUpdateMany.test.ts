import { mutationUpdateMany } from "../../../src/utils/graphql";
import { gqlRequest, generateRequest } from "../../../src/utils/graphql/utils";
import { RequestMethod, RequestOperation } from "../../../src/utils/graphql/enums";

jest.mock("../../../src/utils/graphql/utils", () => ({
  gqlRequest: jest.fn(),
  generateRequest: jest.fn(),
}));

describe("mutationUpdateMany", () => {
  const mockGenerateRequest = generateRequest as jest.Mock;
  const mockGqlRequest = gqlRequest as jest.Mock;

  const modelName = "User";
  const partialRecord = { active: true };
  const options = { where: { age: { gt: 18 } }, _log_request: true };
  const fakeRequestObject = { query: "mock update many request" };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateRequest.mockReturnValue(fakeRequestObject);
  });

  it("should return array of IDs on success", async () => {
    const responseKey = RequestOperation.UpdateMany + modelName;
    const expectedResponse = {
      [responseKey]: [{ id: 1 }, { id: 2 }, { id: 3 }],
    };
    mockGqlRequest.mockResolvedValue(expectedResponse);

    const result = await mutationUpdateMany(modelName, partialRecord, options);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.UpdateMany,
      {
        queryArguments: {
          where: options.where,
          input: partialRecord,
        },
      },
      options._log_request,
    );
    expect(mockGqlRequest).toHaveBeenCalledWith(fakeRequestObject);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should work when options is undefined", async () => {
    const responseKey = RequestOperation.UpdateMany + modelName;
    const expectedResponse = {
      [responseKey]: [{ id: 10 }],
    };
    mockGqlRequest.mockResolvedValue(expectedResponse);

    const result = await mutationUpdateMany(modelName, partialRecord);

    expect(mockGenerateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Mutation,
      RequestOperation.UpdateMany,
      {
        queryArguments: {
          where: undefined,
          input: partialRecord,
        },
      },
      undefined,
    );
    expect(result).toEqual([10]);
  });

  it("should throw if expected response key is missing", async () => {
    mockGqlRequest.mockResolvedValue({});

    await expect(mutationUpdateMany(modelName, partialRecord, options)).rejects.toThrow();
  });
});
