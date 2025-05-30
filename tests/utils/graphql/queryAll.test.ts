import { queryAll } from "../../../src/utils/graphql";
import { gqlRequest, formatResponse, generateRequest } from "../../../src/utils/graphql/utils";
import { RequestMethod, RequestOperation } from "../../../src/utils/graphql/enums";

jest.mock("../../../src/utils/graphql/utils", () => ({
  gqlRequest: jest.fn(),
  generateRequest: jest.fn(),
  formatResponse: jest.fn(),
}));

describe("queryAll", () => {
  const modelName = "Item";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return totalCount and formatted data", async () => {
    const options = {
      fields: { id: true, name: true },
      queryArguments: {
        where: { active: true },
        take: 5,
        skip: 0,
      },
      _log_request: false,
    };

    type ItemType = { id: number; name: string };

    const gqlResponse: Record<string, { totalCount: number; results: ItemType[] }> = {
      [`all${modelName}`]: {
        totalCount: 100,
        results: [
          { id: 1, name: "First" },
          { id: 2, name: "Second" },
        ],
      },
    };

    const formattedData: ItemType[] = [
      { id: 1, name: "First" },
      { id: 2, name: "Second" },
    ];

    (generateRequest as jest.Mock).mockReturnValue("mockQuery");
    (gqlRequest as jest.Mock).mockResolvedValue(gqlResponse);
    (formatResponse as jest.Mock).mockReturnValue(formattedData);

    const result = await queryAll<ItemType>(modelName, options);

    expect(generateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Query,
      RequestOperation.All,
      options,
      options._log_request,
    );

    expect(gqlRequest).toHaveBeenCalledWith("mockQuery");

    expect(formatResponse).toHaveBeenCalledWith(gqlResponse[`all${modelName}`].results, options.fields);

    expect(result).toEqual({
      totalCount: 100,
      data: formattedData,
    });
  });

  it("should handle missing options.queryArguments and _log_request", async () => {
    const options = {
      fields: { id: true },
    };

    type ItemType = { id: number };

    const gqlResponse: Record<string, { totalCount: number; results: ItemType[] }> = {
      [`all${modelName}`]: {
        totalCount: 0,
        results: [],
      },
    };

    (generateRequest as jest.Mock).mockReturnValue("mockQuery");
    (gqlRequest as jest.Mock).mockResolvedValue(gqlResponse);
    (formatResponse as jest.Mock).mockReturnValue([]);

    const result = await queryAll<ItemType>(modelName, options);

    expect(generateRequest).toHaveBeenCalledWith(
      modelName,
      RequestMethod.Query,
      RequestOperation.All,
      options,
      undefined,
    );

    expect(result).toEqual({
      totalCount: 0,
      data: [],
    });
  });

  it("should return { totalCount: 0, data: [] } if response or response[`all${modelName}`] is missing", async () => {
    const options = {
      fields: { id: true },
    };

    (generateRequest as jest.Mock).mockReturnValue("mockQuery");
    (gqlRequest as jest.Mock).mockResolvedValue(null);

    let result = await queryAll<typeof options.fields>(modelName, options);
    expect(result).toEqual({ totalCount: 0, data: [] });

    (gqlRequest as jest.Mock).mockResolvedValue(undefined);

    result = await queryAll<typeof options.fields>(modelName, options);
    expect(result).toEqual({ totalCount: 0, data: [] });

    (gqlRequest as jest.Mock).mockResolvedValue({ someOtherKey: {} });

    result = await queryAll<typeof options.fields>(modelName, options);
    expect(result).toEqual({ totalCount: 0, data: [] });
  });
});
