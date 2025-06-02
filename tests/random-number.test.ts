import generateRandomNumber from "../src/random-number/1.0/index";
import { getRandomIntInRange } from "../src/utils";

jest.mock("../src/utils", () => ({
  getRandomIntInRange: jest.fn(),
}));

describe("generateRandomNumber", () => {
  it("should return a random number using default range", async () => {
    (getRandomIntInRange as jest.Mock).mockReturnValue(42);

    const result = await generateRandomNumber({});
    expect(getRandomIntInRange).toHaveBeenCalledWith(0, 100);
    expect(result).toEqual({ result: 42 });
  });

  it("should return a random number using custom range", async () => {
    (getRandomIntInRange as jest.Mock).mockReturnValue(77);

    const result = await generateRandomNumber({ min: 50, max: 80 });
    expect(getRandomIntInRange).toHaveBeenCalledWith(50, 80);
    expect(result).toEqual({ result: 77 });
  });
});
