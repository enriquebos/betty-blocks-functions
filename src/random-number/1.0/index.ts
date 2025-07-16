import { getRandomIntInRange } from "../../utils";
import type { RandomNumberOptions } from "../../types/functions";

const generateRandomNumber = async ({
  min = 0,
  max = 100,
}: RandomNumberOptions): Promise<{ result: number }> => ({
  result: getRandomIntInRange(min, max),
});

export default generateRandomNumber;
