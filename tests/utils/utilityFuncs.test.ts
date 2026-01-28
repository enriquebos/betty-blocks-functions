import { replaceTemplateVariables } from "../../src/utils/templating";
import { chunkArray, variableMap, strftime, transformData } from "../../src/utils";
import type { MappingItem } from "../../src/types/global";

describe("chunkArray", () => {
  it("should chunk an array into smaller arrays of given size", () => {
    const array = [1, 2, 3, 4, 5, 6, 7];
    const chunkSize = 3;

    const chunks = Array.from(chunkArray(array, chunkSize));

    expect(chunks).toStrictEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it("should handle an array smaller than the chunk size", () => {
    const array = [1, 2];
    const chunkSize = 5;

    const chunks = Array.from(chunkArray(array, chunkSize));

    expect(chunks).toStrictEqual([[1, 2]]);
  });

  it("should handle an empty array", () => {
    const array: number[] = [];
    const chunkSize = 3;

    const chunks = Array.from(chunkArray(array, chunkSize));

    expect(chunks).toStrictEqual([]);
  });

  it("should handle a chunk size of 1", () => {
    const array = [1, 2, 3];
    const chunkSize = 1;

    const chunks = Array.from(chunkArray(array, chunkSize));

    expect(chunks).toStrictEqual([[1], [2], [3]]);
  });

  it("should handle a chunk size equal to array length", () => {
    const array = [1, 2, 3, 4];
    const chunkSize = 4;

    const chunks = Array.from(chunkArray(array, chunkSize));

    expect(chunks).toStrictEqual([[1, 2, 3, 4]]);
  });

  it("should throw a RangeError if chunkSize is 0 or lower", () => {
    const array = [1, 2, 3];

    expect(() => Array.from(chunkArray(array, 0))).toThrow(RangeError);
    expect(() => Array.from(chunkArray(array, -1))).toThrow(RangeError);
  });
});

describe("variableMap", () => {
  test("should convert an array of key-value pairs into an object", () => {
    const input = [
      { key: "a", value: "1" },
      { key: "b", value: "2" },
      { key: "c", value: "3" },
    ];

    expect(variableMap(input)).toStrictEqual({ a: "1", b: "2", c: "3" });
  });

  test("should return an empty object when given an empty array", () => {
    expect(variableMap([])).toStrictEqual({});
  });

  test("should handle duplicate keys by using the last occurrence", () => {
    const input = [
      { key: "a", value: "1" },
      { key: "b", value: "2" },
      { key: "a", value: "3" },
    ];

    expect(variableMap(input)).toStrictEqual({ a: "3", b: "2" });
  });

  test("should handle keys with empty string values", () => {
    const input = [
      { key: "a", value: "" },
      { key: "b", value: "2" },
    ];

    expect(variableMap(input)).toStrictEqual({ a: "", b: "2" });
  });

  test("should handle an array with a single key-value pair", () => {
    const input = [{ key: "x", value: "y" }];
    const expectedOutput = { x: "y" };

    expect(variableMap(input)).toStrictEqual(expectedOutput);
  });
});

describe("replaceTemplateVariables", () => {
  test("should replace variables correctly", () => {
    const text = "Hello, {{ name }}!";
    const variables = [{ key: "name", value: "Alice" }];

    expect(replaceTemplateVariables(text, variables)).toBe("Hello, Alice!");
  });

  test("should be empty if test is empty", () => {
    const text: string | undefined = undefined;
    const variables = [{ key: "name", value: "Alice" }];

    expect(replaceTemplateVariables(text, variables)).toBe("");
  });

  test("should replace multiple occurrences of the same variable", () => {
    const text = "{{ greeting }}, {{ name }}! {{ greeting }}, again!";
    const variables = [
      { key: "greeting", value: "Hi" },
      { key: "name", value: "Bob" },
    ];

    expect(replaceTemplateVariables(text, variables)).toBe("Hi, Bob! Hi, again!");
  });

  test("should leave unknown variables unchanged and log warning", () => {
    console.log = jest.fn();
    const text = "Welcome, {{ user }}!";
    const variables = [{ key: "name", value: "Charlie" }];

    expect(replaceTemplateVariables(text, variables)).toBe("Welcome, {{ user }}!");
    expect(console.log).toHaveBeenCalledWith("Unknown map variable 'user' in text field");
  });

  test("should handle special character prefixes correctly", () => {
    const text = "Escaped: {{{ name }}} and {{ value }}";
    const variables = [
      { key: "name", value: "John" },
      { key: "value", value: "Doe" },
    ];

    expect(replaceTemplateVariables(text, variables)).toBe("Escaped: John and Doe");
  });

  test("should handle an empty variables array", () => {
    const text = "Hello, {{ name }}!";
    const variables: { key: string; value: string }[] = [];

    expect(replaceTemplateVariables(text, variables)).toBe("Hello, {{ name }}!");
  });

  test("should return original text when there are no placeholders", () => {
    const text = "No placeholders here.";
    const variables = [{ key: "unused", value: "value" }];

    expect(replaceTemplateVariables(text, variables)).toBe("No placeholders here.");
  });

  test("should handle overlapping variable names correctly", () => {
    const text = "{{ var }} and {{ variable }}";
    const variables = [
      { key: "var", value: "one" },
      { key: "variable", value: "two" },
    ];

    expect(replaceTemplateVariables(text, variables)).toBe("one and two");
  });
});

describe("transformData", () => {
  it("transforms valid input with named keys", () => {
    const input: MappingItem[] = [
      { key: [{ kind: "type1", name: "foo" }], value: 123 },
      { key: [{ kind: "type2", name: "bar" }], value: "hello" },
    ];

    const result = transformData(input);

    expect(result).toEqual({ foo: 123, bar: "hello" });
  });

  it("ignores items with an empty key array", () => {
    const input: MappingItem[] = [
      { key: [], value: "shouldIgnore" },
      { key: [{ kind: "x", name: "valid" }], value: true },
    ];

    const result = transformData(input);

    expect(result).toEqual({ valid: true });
  });

  it("ignores items where key[0] has no name", () => {
    const input: MappingItem[] = [
      { key: [{ kind: "x", name: "" }], value: "shouldIgnore" },
      { key: [{ kind: "y", name: "included" }], value: 42 },
    ];

    const result = transformData(input);

    expect(result).toEqual({ included: 42 });
  });

  it("overwrites duplicate key names with latest value", () => {
    const input: MappingItem[] = [
      { key: [{ kind: "a", name: "dup" }], value: 1 },
      { key: [{ kind: "b", name: "dup" }], value: 2 },
    ];

    const result = transformData(input);

    expect(result).toEqual({ dup: 2 });
  });

  it("returns an empty object for empty input", () => {
    const result = transformData([]);
    expect(result).toEqual({});
  });

  it("handles various value types", () => {
    const input: MappingItem[] = [
      { key: [{ kind: "num", name: "number" }], value: 100 },
      { key: [{ kind: "str", name: "string" }], value: "text" },
      { key: [{ kind: "bool", name: "boolean" }], value: false },
      { key: [{ kind: "null", name: "nullVal" }], value: null },
      { key: [{ kind: "arr", name: "array" }], value: [1, 2, 3] },
      { key: [{ kind: "obj", name: "object" }], value: { x: 1 } },
    ];

    const result = transformData(input);

    expect(result).toEqual({
      number: 100,
      string: "text",
      boolean: false,
      nullVal: null,
      array: [1, 2, 3],
      object: { x: 1 },
    });
  });
});

describe("strftime", () => {
  const mockDate = new Date("2024-10-05T14:30:45Z");
  const timeZoneReg = /^(GMT|UTC)[+-](1[0-2]|[0-9])$/;
  const timeZoneOffsetReg = /^(\+|-)\d{4}$/;

  beforeAll(() => {
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should handle local datetime, %u", () => {
    expect(strftime("%Y-%m-%d", "en", new Date(), 0, false)).toBe("2024-10-05");
  });

  it("should handle a leap year", () => {
    expect(strftime("%Y-%m-%d %j", "en", new Date(), 0, false)).toBe("2024-10-05 279");
  });

  it("should not handle a leap year", () => {
    expect(strftime("%Y-%m-%d %j", "en", new Date("2023-10-05T14:30:45Z"), 0, false)).toBe(
      "2023-10-05 278",
    );
  });

  it("should handle a datetime object", () => {
    expect(strftime("%Y-%m-%d", "en", new Date(), 0, true)).toBe("2024-10-05");
  });

  it("should format %Y-%m-%d correctly", () => {
    expect(strftime("%Y-%m-%d", "en", new Date(), 0, true)).toBe("2024-10-05");
  });

  it("should format %H:%M:%S correctly", () => {
    expect(strftime("%H:%M:%S", "en", new Date(), 0, true)).toBe("14:30:45");
  });

  it("should format %I:%M %p correctly", () => {
    expect(strftime("%I:%M %p", "en", new Date(), 0, true)).toBe("02:30 PM");
  });

  it("should format %A, %B %d, %Y correctly", () => {
    expect(strftime("%A, %B %d, %Y", "en", new Date(), 0, true)).toBe("Saturday, October 05, 2024");
  });

  it("should format %j (day of the year) correctly", () => {
    expect(strftime("%j", "en", new Date(), 0, true)).toBe("279");
  });

  it("should format %V (ISO week number) correctly", () => {
    expect(strftime("%V", "en", new Date(), 0, true)).toBe("40");
  });

  it("should format %z (timezone offset) correctly", () => {
    expect(strftime("%z", "en", new Date(), 0, true)).toMatch(timeZoneOffsetReg);
  });

  it("should format %Zs (short timezone name) correctly", () => {
    expect(strftime("%Zs", "en", new Date(), 0, true)).toMatch(timeZoneReg);
  });

  it("should handle unknown format specifiers by returning them as-is", () => {
    expect(strftime("%Q", "en", new Date(), 0, true)).toBe("%Q");
  });

  it("should handle empty format string", () => {
    expect(strftime("", "en", new Date(), 0, true)).toBe("");
  });

  it("should handle invalid format string (non-string input)", () => {
    expect(strftime(123 as never, "en", new Date(), 0, true)).toBe("");
  });

  it("should handle all other formats", () => {
    expect(
      strftime(
        "%a,%A,%b,%B,%c,%C,%d,%e,%F,%G,%g,%H,%I,%j,%k,%l,%m,%n,%M,%p,%P,%s,%S,%u,%V,%w,%x,%X,%y,%Y,%z,%Z,%Zs",
        "en",
        new Date("2024-10-06T11:30:45Z"),
        0,
        true,
      ),
    ).toBe(
      "Sun,Sunday,Oct,October,Sun 06 Oct 2024 11:30:45 GMT,20,06,6,2024-10-06,2024,24,11,11,280,11,11,10,10,30,AM,am,1728214245,45,7,40,%w,10/6/2024,1:30:45 PM,24,2024,+0200,Central European Summer Time,GMT+2",
    );
  });
});
