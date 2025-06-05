import { formatResponse } from "../../../../src/utils/graphql/utils";

describe("formatResponse", () => {
  it("should format a simple object with primitive constructors", () => {
    const response = {
      id: "123",
      active: "true",
      score: "100",
    };

    const result = {
      id: Number,
      active: Boolean,
      score: Number,
    };

    const formatted = formatResponse(response, result);

    expect(formatted).toEqual({
      id: 123,
      active: true,
      score: 100,
    });
  });

  it("should handle nested objects", () => {
    const response = {
      user: {
        name: "Alice",
        age: "30",
      },
    };

    const result = {
      user: {
        name: String,
        age: Number,
      },
    };

    const formatted = formatResponse(response, result);

    expect(formatted).toEqual({
      user: {
        name: "Alice",
        age: 30,
      },
    });
  });

  it("should format an array of objects", () => {
    const response = [
      { id: "1", name: "One" },
      { id: "2", name: "Two" },
    ];

    const result = {
      id: Number,
      name: String,
    };

    const formatted = formatResponse(response, result);

    expect(formatted).toEqual([
      { id: 1, name: "One" },
      { id: 2, name: "Two" },
    ]);
  });

  it("should preserve Date instances", () => {
    const dateStr = "2024-01-01T00:00:00.000Z";
    const response = {
      createdAt: dateStr,
    };

    const result = {
      createdAt: Date,
    };

    const formatted = formatResponse(response, result) as object & { createdAt: Date };

    expect(formatted.createdAt).toBeInstanceOf(Date);
    expect(formatted.createdAt.toISOString()).toEqual(dateStr);
  });

  it("should return unformatted object when result is not provided", () => {
    const response = { foo: "bar" };
    const formatted = formatResponse(response);

    expect(formatted).toEqual({});
  });

  it("should handle complex nested structures with arrays", () => {
    const response = {
      users: [
        { id: "1", profile: { name: "Alice", age: "25" } },
        { id: "2", profile: { name: "Bob", age: "30" } },
      ],
    };

    const result = {
      users: {
        id: Number,
        profile: {
          name: String,
          age: Number,
        },
      },
    };

    const formatted = formatResponse(response, result);

    expect(formatted).toEqual({
      users: [
        { id: 1, profile: { name: "Alice", age: 25 } },
        { id: 2, profile: { name: "Bob", age: 30 } },
      ],
    });
  });

  it("should handle empty objects gracefully", () => {
    const response = {};
    const result = {};

    const formatted = formatResponse(response, result);

    expect(formatted).toEqual({});
  });

  it("should assign value as-is when result key is not a function or object", () => {
    const response = {
      rawData: "unchanged",
    };

    const result = {
      rawData: 123 as never,
    };

    const formatted = formatResponse(response, result);

    expect(formatted).toEqual({
      rawData: "unchanged",
    });
  });
});
