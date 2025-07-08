import { getRandomIntInRange } from "../../src/utils";

describe("getRandomIntInRange", () => {
  it("returns a number within the given range (inclusive)", () => {
    const min = 5;
    const max = 10;

    for (let i = 0; i < 100; i++) {
      const result = getRandomIntInRange(min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
      expect(Number.isInteger(result)).toBe(true);
    }
  });

  it("returns the same value when min equals max", () => {
    const result = getRandomIntInRange(7, 7);
    expect(result).toBe(7);
  });

  it("returns different values over multiple calls", () => {
    const min = 1;
    const max = 3;
    const results = new Set();

    for (let i = 0; i < 100; i++) {
      results.add(getRandomIntInRange(min, max));
    }

    expect(results.size).toBeGreaterThan(1);
  });
});
