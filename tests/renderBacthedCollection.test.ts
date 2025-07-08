import resolveLazyCollection from "../src/render-batched-collection/1.0/index";

describe("resolveLazyCollection", () => {
  it("should resolve a collection with plain objects", async () => {
    const collection = {
      data: [{ id: 1 }, { id: 2 }],
    };

    const result = await resolveLazyCollection({ collection });

    expect(result).toEqual({
      resolved: [{ id: 1 }, { id: 2 }],
    });
  });

  it("should resolve an empty collection", async () => {
    const collection = {
      data: [],
    };

    const result = await resolveLazyCollection({ collection });

    expect(result).toEqual({ resolved: [] });
  });

  it("should resolve a lazy iterable (e.g. generator)", async () => {
    function* generateData() {
      yield { id: "a" };
      yield { id: "b" };
    }

    const collection = {
      data: generateData(),
    };

    const result = await resolveLazyCollection({ collection });

    expect(result).toEqual({
      resolved: [{ id: "a" }, { id: "b" }],
    });
  });

  it("should resolve Set as an iterable", async () => {
    const collection = {
      data: new Set([{ name: "Alice" }, { name: "Bob" }]),
    };

    const result = await resolveLazyCollection({ collection });

    expect(result).toEqual({
      resolved: [{ name: "Alice" }, { name: "Bob" }],
    });
  });
});
