interface RandomNumberParams {
  min: number;
  max: number;
}

interface RandomNumberResult {
  returning: number;
}

const generateRandomNumber = async ({
  min,
  max,
}: RandomNumberParams): Promise<RandomNumberResult> => {
  const mini: number = Math.ceil(min);
  const maxi: number = Math.floor(max);
  const randomNumber: number =
    Math.floor(Math.random() * (maxi - mini + 1)) + mini;
  return {
    returning: randomNumber,
  };
};

export default generateRandomNumber;
