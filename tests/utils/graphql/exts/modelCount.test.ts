import { modelCount } from "../../../../src/utils/graphql/exts";
import { gqlRequest, generateRequest } from "../../../../src/utils/graphql/utils";
import { RequestMethod, RequestOperation } from "../../../../src/utils/graphql/enums";

jest.mock("../../../../src/utils/graphql/utils", () => ({
  gqlRequest: jest.fn(),
  generateRequest: jest.fn(),
}));

describe("modelCount", () => {
  const modelName = "User";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the totalCount from the response", async () => {
    const mockQuery = { some: "query" };
    const mockResponse = {
      [RequestOperation.All + modelName]: { totalCount: 42 },
    };

    (generateRequest as jest.Mock).mockReturnValue(mockQuery);
    (gqlRequest as jest.Mock).mockResolvedValue(mockResponse);

    const result = await modelCount(modelName);

    expect(generateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Query,
      RequestOperation.All,
      {
        queryArguments: {
          where: undefined,
          totalCount: true,
          take: 1,
        },
      },
      undefined,
    );

    expect(gqlRequest).toHaveBeenCalledWith(mockQuery);
    expect(result).toBe(42);
  });

  it("should handle options.where correctly", async () => {
    const whereClause = { isActive: true };
    const mockQuery = { some: "query" };
    const mockResponse = {
      [RequestOperation.All + modelName]: { totalCount: 10 },
    };

    (generateRequest as jest.Mock).mockReturnValue(mockQuery);
    (gqlRequest as jest.Mock).mockResolvedValue(mockResponse);

    const result = await modelCount(modelName, { where: whereClause });

    expect(generateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Query,
      RequestOperation.All,
      {
        queryArguments: {
          where: whereClause,
          totalCount: true,
          take: 1,
        },
      },
      undefined,
    );

    expect(result).toBe(10);
  });

  it("should handle _log_request option", async () => {
    const mockQuery = { another: "query" };
    const mockResponse = {
      [RequestOperation.All + modelName]: { totalCount: 99 },
    };

    (generateRequest as jest.Mock).mockReturnValue(mockQuery);
    (gqlRequest as jest.Mock).mockResolvedValue(mockResponse);

    const result = await modelCount(modelName, {
      _log_request: true,
    });

    expect(generateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Query,
      RequestOperation.All,
      {
        queryArguments: {
          where: undefined,
          totalCount: true,
          take: 1,
        },
      },
      true,
    );

    expect(result).toBe(99);
  });
});
