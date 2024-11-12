interface RandomNumberParams {
  min: number;
  max: number;
}

const generateRandomNumber = async ({
  min,
  max,
}: RandomNumberParams): Promise<{ result: string | number }> => {
  const mini: number = Math.ceil(min ? min : 0);
  const maxi: number = Math.floor(max);
  const randomNumber: number =
    Math.floor(Math.random() * (maxi - mini + 1)) + mini;
  return {
    result: randomNumber,
  };
};

export default generateRandomNumber;
