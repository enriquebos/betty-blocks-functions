import { generateRequest } from "../../../../src/utils/graphql/utils";
import { RequestOperation, RequestMethod } from "../../../../src/utils/graphql/enums";

declare type Sort = {
  field?: string;
  order?: "ASC" | "DESC";
  relation?: Record<string, "ASC" | "DESC" | NestedSort>;
};

declare type NestedSort = {
  [key: string]: "ASC" | "DESC" | NestedSort;
};

describe("generateRequest", () => {
  const mockFields = {
    id: Number,
    name: String,
    favorite: Boolean,
    createdAt: Date,
    webuser: {
      id: Number,
      createdAt: Date,
    },
  };

  it("generates a basic query with fields", () => {
    const result = generateRequest("Pokemon", RequestMethod.Query, RequestOperation.All, {
      fields: mockFields,
    });

    expect(result).toContain("query {");
    expect(result).toContain("Pokemon");
    expect(result).toContain("id");
    expect(result).toContain("webuser");
  });

  it("includes where clause in query", () => {
    const where = {
      webuser: {
        firstName: {
          eq: "Ash",
        },
      },
    };

    const result = generateRequest("Pokemon", RequestMethod.Query, RequestOperation.All, {
      fields: mockFields,
      queryArguments: { where },
    });

    expect(result).toContain('where: { webuser: { firstName: { eq: "Ash" } } }');
  });

  it("includes sort, skip and take", () => {
    const sort: Sort = { field: "createdAt", order: "DESC" };

    const result = generateRequest("Pokemon", RequestMethod.Query, RequestOperation.All, {
      fields: mockFields,
      queryArguments: {
        sort,
        skip: 10,
        take: 50,
      },
    });

    expect(result).toContain("sort: { field: createdAt, order: DESC }");
    expect(result).toContain("skip: 10");
    expect(result).toContain("take: 50");
  });

  it("throws error for skip out of range", () => {
    expect(() =>
      generateRequest("Pokemon", RequestMethod.Query, RequestOperation.All, {
        queryArguments: { skip: -1 },
      })
    ).toThrow("Skip value must be between 0 and 2147483647 (32bit)");
  });

  it("throws error for take out of range", () => {
    expect(() =>
      generateRequest("Pokemon", RequestMethod.Query, RequestOperation.All, {
        queryArguments: { take: 6000 },
      })
    ).toThrow("Take value must be between 1 and 5000");
  });

  it("throws error when using uniqueBy with non-upsert operation", () => {
    expect(() =>
      generateRequest("Pokemon", RequestMethod.Query, RequestOperation.All, {
        queryArguments: { uniqueBy: ["id"] },
      })
    ).toThrow("Cannot use uniqueBy for non-upserting mutations");
  });

  it("throws error for validate flag on query request", () => {
    expect(() =>
      generateRequest("Pokemon", RequestMethod.Query, RequestOperation.All, {
        queryArguments: { validate: true },
      })
    ).toThrow("Cannot validate request for query");
  });

  it("throws error for validate flag on delete mutation", () => {
    expect(() =>
      generateRequest("Pokemon", RequestMethod.Mutation, RequestOperation.Delete, {
        queryArguments: { validate: true },
      })
    ).toThrow("Cannot input validate for delete since it doesn't validate anything");
  });

  it("includes validationSets in upsert mutation", () => {
    const result = generateRequest("Pokemon", RequestMethod.Mutation, RequestOperation.Upsert, {
      queryArguments: { validate: true, uniqueBy: ["id"] },
    });

    expect(result).toContain("validationSets: ['default']");
    expect(result).toContain('uniqueBy: ["id"]');
  });

  it("includes totalCount when requested", () => {
    const result = generateRequest("Pokemon", RequestMethod.Query, RequestOperation.All, {
      fields: mockFields,
      queryArguments: { totalCount: true },
    });

    expect(result).toContain("totalCount");
  });

  it("includes input object in mutation", () => {
    const result = generateRequest("Pokemon", RequestMethod.Mutation, RequestOperation.Create, {
      queryArguments: {
        input: {
          name: "Pikachu",
          type: "Electric",
        },
      },
    });

    expect(result).toContain('input: { name: "Pikachu", type: "Electric" }');
  });

  it("defaults to 'id' when no fields are provided", () => {
    const result = generateRequest("Pokemon", RequestMethod.Query, RequestOperation.All);

    expect(result).toContain("id");
  });

  it("includes validationSets with correct value when validate is false", () => {
    const result = generateRequest("Pokemon", RequestMethod.Mutation, RequestOperation.Upsert, {
      queryArguments: {
        validate: false,
        uniqueBy: ["id"],
      },
    });

    expect(result).toContain("validationSets: ['empty']");
  });

  it("includes id in the request arguments when provided", () => {
    const result = generateRequest("Pokemon", RequestMethod.Query, RequestOperation.One, {
      queryArguments: { id: 123 },
    });

    expect(result).toContain("id: 123");
  });

  it("logs the request when _log_request is true", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    generateRequest("Pokemon", RequestMethod.Query, RequestOperation.All, {}, true);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("query {"));
    consoleSpy.mockRestore();
  });

  it("stringifies input with non-string primitive values correctly", () => {
    const input = { name: "Bulbasaur", level: 5, shiny: false };
    const result = generateRequest("Pokemon", RequestMethod.Mutation, RequestOperation.Create, {
      queryArguments: { input },
    });

    expect(result).toContain('input: { name: "Bulbasaur", level: 5, shiny: false }');
  });

  it("stringifies input array recursively", () => {
    const input = [{ name: "Charmander" }, { name: "Squirtle" }];
    const result = generateRequest("Pokemon", RequestMethod.Mutation, RequestOperation.Create, {
      queryArguments: { input },
    });

    expect(result).toContain('input: { 0:{ name: \"Charmander\" }, 1:{ name: \"Squirtle\" } }');
  });
});
