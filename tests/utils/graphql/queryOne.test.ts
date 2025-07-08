import { queryOne } from "../../../src/utils/graphql";
import { gqlRequest, generateRequest, formatResponse } from "../../../src/utils/graphql/utils";
import { RequestMethod, RequestOperation } from "../../../src/utils/graphql/enums";

jest.mock("../../../src/utils/graphql/utils", () => ({
  gqlRequest: jest.fn(),
  generateRequest: jest.fn(),
  formatResponse: jest.fn(),
}));

describe("queryOne", () => {
  const modelName = "Product";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return formatted response for given fields", async () => {
    const fields = { id: true, name: true };
    const queryArgs = { where: { id: 1 } };

    const mockQuery = { mocked: "query" };
    const gqlResult = {
      [RequestOperation.One + modelName]: { id: 1, name: "Sample Product", price: 100 },
    };
    const formattedResult = { id: 1, name: "Sample Product" };

    (generateRequest as jest.Mock).mockReturnValue(mockQuery);
    (gqlRequest as jest.Mock).mockResolvedValue(gqlResult);
    (formatResponse as jest.Mock).mockReturnValue(formattedResult);

    const result = await queryOne<typeof formattedResult>(modelName, {
      fields,
      queryArguments: queryArgs,
    });

    expect(generateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Query,
      RequestOperation.One,
      {
        fields,
        queryArguments: queryArgs,
      },
      undefined,
    );

    expect(gqlRequest).toHaveBeenCalledWith(mockQuery);
    expect(formatResponse).toHaveBeenCalledWith(gqlResult[RequestOperation.One + modelName], fields);
    expect(result).toEqual(formattedResult);
  });

  it("should handle _log_request inside queryArguments", async () => {
    const fields = { id: true };
    const gqlResult: Record<string, unknown> = {
      [RequestOperation.One + modelName]: { id: 1 },
    };
    const formattedResult = { id: 1 };

    (generateRequest as jest.Mock).mockReturnValue("mockQueryWithLog");
    (gqlRequest as jest.Mock).mockResolvedValue(gqlResult);
    (formatResponse as jest.Mock).mockReturnValue(formattedResult);

    const result = await queryOne<typeof formattedResult>(modelName, {
      fields,
      queryArguments: {
        where: { id: 1 },
      },
      _log_request: true,
    });

    expect(generateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Query,
      RequestOperation.One,
      {
        fields,
        queryArguments: {
          where: { id: 1 },
        },
        _log_request: true,
      },
      true,
    );

    expect(gqlRequest).toHaveBeenCalledWith("mockQueryWithLog");
    expect(result).toEqual(formattedResult);
  });

  it("should return undefined if no model data is returned", async () => {
    const fields = { id: true };
    const gqlResult: Record<string, unknown> = {
      [RequestOperation.One + modelName]: undefined,
    };

    (generateRequest as jest.Mock).mockReturnValue("mockQuery");
    (gqlRequest as jest.Mock).mockResolvedValue(gqlResult);
    (formatResponse as jest.Mock).mockReturnValue(undefined);

    const result = await queryOne<{ id: number }>(modelName, { fields });

    expect(result).toBeNull();
  });

  it("should use default fields if fields option is not provided", async () => {
    const gqlResult: Record<string, unknown> = {
      [RequestOperation.One + modelName]: { id: 123 },
    };
    const formattedResult = { id: 123 };

    (generateRequest as jest.Mock).mockReturnValue("mockQueryDefaultFields");
    (gqlRequest as jest.Mock).mockResolvedValue(gqlResult);
    (formatResponse as jest.Mock).mockReturnValue(formattedResult);

    const result = await queryOne<{ id: number }>(modelName, {
      queryArguments: { where: { id: 123 } },
    });

    expect(generateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Query,
      RequestOperation.One,
      {
        queryArguments: { where: { id: 123 } },
      },
      undefined,
    );

    expect(formatResponse).toHaveBeenCalledWith(gqlResult[RequestOperation.One + modelName], { id: Number });

    expect(result).toEqual(formattedResult);
  });
});
