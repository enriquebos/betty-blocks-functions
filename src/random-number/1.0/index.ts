import { getRandomIntInRange } from "../../utils";

const generateRandomNumber = async ({
  min = 0,
  max = 100,
}: {
  min?: number;
  max?: number;
}): Promise<{ result: number }> => ({
  result: getRandomIntInRange(min, max),
});

export default generateRandomNumber;
