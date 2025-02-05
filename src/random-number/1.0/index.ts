const generateRandomNumber = async ({
  min,
  max,
}: {
  min?: number;
  max?: number;
}): Promise<{ result: string | number }> => {
  const minNumber: number = Math.ceil(min ?? 0);
  const maxNumber: number = Math.floor(max ?? 100);

  return {
    result: Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber,
  };
};

export default generateRandomNumber;
