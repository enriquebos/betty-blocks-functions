import { gqlRequest } from "../../../../src/utils/graphql/utils";

declare global {
  let gql: (operation: string, input: object) => Promise<{ data?: object; error?: Error }>;
}

describe("gqlRequest", () => {
  beforeEach(() => {
    // @ts-expect-error Mocking global gql function
    global.gql = jest.fn();
  });

  it("should call gql with operation and input", async () => {
    const mockData = { someKey: "someValue" };

    // @ts-expect-error global.gql is mocked
    global.gql.mockResolvedValue({ data: mockData });

    const result = await gqlRequest("query TestQuery", { input: { id: 1 } });

    // @ts-expect-error global.gql is mocked
    expect(global.gql).toHaveBeenCalledWith("query TestQuery", { input: { id: 1 } });
    expect(result).toBe(mockData);
  });

  it("should throw if gql returns errors", async () => {
    const mockErrors = [{ message: "Something went wrong" }];

    // @ts-expect-error global.gql is mocked
    global.gql.mockResolvedValue({ errors: mockErrors });

    await expect(gqlRequest("query TestQuery", {})).rejects.toEqual(mockErrors);
  });

  it("should throw if operation length exceeds limit", async () => {
    const longOperation = "a".repeat(4194305);

    await expect(gqlRequest(longOperation)).rejects.toThrow(/GraphQL request length exceeds maximum allowed size/);
  });
});
