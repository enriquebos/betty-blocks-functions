import dateStrftime from "../src/date-strftime/1.0/index";
import { strftime } from "../src/utils";

jest.mock("../src/utils", () => ({
  strftime: jest.fn(),
}));

describe("dateStrftime", () => {
  const mockStrftime = strftime as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should format a valid Date object with default format", async () => {
    const date = new Date("2024-05-20T12:00:00Z");
    mockStrftime.mockReturnValue("formatted-date");

    const result = await dateStrftime({
      datetime: date,
      offsetType: "mm",
      offset: 0,
      useUtc: false,
      locale: "en",
      strftimeDefault: "%Y-%m-%d",
    });

    expect(result).toEqual({ as: "formatted-date" });
    expect(mockStrftime).toHaveBeenCalledWith("%Y-%m-%d", "en", date, 0, false);
  });

  it("should format a custom format string", async () => {
    mockStrftime.mockReturnValue("custom-format");

    const result = await dateStrftime({
      datetime: "2024-01-01T00:00:00Z",
      offsetType: "mm",
      offset: 0,
      useUtc: true,
      locale: "en",
      strftimeDefault: "custom",
      strftimeStr: "%d/%m/%Y",
    });

    expect(result).toEqual({ as: "custom-format" });
    expect(mockStrftime).toHaveBeenCalled();
  });

  it("should use current date when datetime is 'now'", async () => {
    const now = new Date();
    const spy = jest.spyOn(global, "Date").mockImplementation(() => now as Date);
    mockStrftime.mockReturnValue("now-date");

    const result = await dateStrftime({
      datetime: "now",
      offsetType: "mm",
      offset: 0,
      useUtc: false,
      locale: "en",
      strftimeDefault: "%x",
    });

    expect(result).toEqual({ as: "now-date" });
    spy.mockRestore();
  });

  it("should handle numeric UNIX timestamp input", async () => {
    const timestamp = 1716912000;
    const expectedDate = new Date(timestamp);
    mockStrftime.mockReturnValue("timestamp-date");

    const result = await dateStrftime({
      datetime: timestamp,
      offsetType: "mm",
      offset: 0,
      useUtc: false,
      locale: "en",
      strftimeDefault: "%x",
    });

    expect(result).toEqual({ as: "timestamp-date" });
    expect(mockStrftime).toHaveBeenCalledWith("%x", "en", expectedDate, 0, false);
  });

  it("should apply offset correctly for 'hh'", async () => {
    const baseDate = new Date("2024-06-01T10:00:00Z");
    mockStrftime.mockReturnValue("offset-date");

    const result = await dateStrftime({
      datetime: baseDate,
      offsetType: "hh",
      offset: 2,
      useUtc: false,
      locale: "en",
      strftimeDefault: "%x",
    });

    expect(result).toEqual({ as: "offset-date" });
    expect(mockStrftime).toHaveBeenCalledWith("%x", "en", baseDate, 120, false);
  });

  it("should throw an error for missing custom format", async () => {
    await expect(
      dateStrftime({
        datetime: "2024-01-01",
        offsetType: "mm",
        offset: 0,
        useUtc: false,
        locale: "en",
        strftimeDefault: "custom",
        strftimeStr: undefined,
      }),
    ).rejects.toThrow("Custom strtime is not defined");
  });

  it("should throw an error for invalid date input", async () => {
    await expect(
      dateStrftime({
        datetime: "not-a-date",
        offsetType: "mm",
        offset: 0,
        useUtc: false,
        locale: "en",
        strftimeDefault: "%x",
      }),
    ).rejects.toThrow("Invalid datetime input, is the notation correct?");
  });

  it("should throw an error if strftimeDefault is 'custom' and strftimeStr is missing", async () => {
    await expect(
      dateStrftime({
        datetime: "2024-01-01",
        offsetType: "mm",
        offset: 0,
        useUtc: false,
        locale: "en",
        strftimeDefault: "custom",
      }),
    ).rejects.toThrow("Custom strtime is not defined");
  });

  it("parses string date correctly", async () => {
    mockStrftime.mockReturnValue("string-date");
    await expect(
      dateStrftime({
        datetime: "2024-06-01T10:00:00Z",
        offsetType: "mm",
        offset: 0,
        useUtc: false,
        locale: "en",
        strftimeDefault: "%Y",
      }),
    ).resolves.toEqual({ as: "string-date" });
  });

  it("parses numeric string timestamp", async () => {
    const timestamp = "1716912000";
    mockStrftime.mockReturnValue("unix-str");
    await expect(
      dateStrftime({
        datetime: timestamp,
        offsetType: "mm",
        offset: 0,
        useUtc: false,
        locale: "en",
        strftimeDefault: "%Y",
      }),
    ).resolves.toEqual({ as: "unix-str" });
  });

  const baseDate = new Date("2024-06-01T00:00:00Z");

  it.each([
    ["ss", 60, 1],
    ["mm", 15, 15],
    ["hh", 2, 120],
    ["DD", 1, 3600],
    ["WW", 1, 21600],
    ["MM", 1, 12960000],
    ["YYYY", 1, 777600000],
  ])("applies offsetType %s correctly", async (offsetType, offset, expectedOffset) => {
    mockStrftime.mockReturnValue("offset-test");

    const result = await dateStrftime({
      datetime: baseDate,
      offsetType: offsetType as string,
      offset,
      useUtc: false,
      locale: "en",
      strftimeDefault: "%x",
    });

    expect(result).toEqual({ as: "offset-test" });
    expect(mockStrftime).toHaveBeenCalledWith("%x", "en", baseDate, expectedOffset, false);
  });

  it("should throw an error for completely invalid datetime type", async () => {
    await expect(
      dateStrftime({
        datetime: { unexpected: "object" } as never,
        offsetType: "mm",
        offset: 0,
        useUtc: false,
        locale: "en",
        strftimeDefault: "%x",
      }),
    ).rejects.toThrow("Invalid date object type (object) for: [object Object]");
  });
});
