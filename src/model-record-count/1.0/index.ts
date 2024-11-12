import { queryRecords } from "../../utils/graphql";

interface ModelRecordCountParams {
  model: {
    name: string;
  };
  filter?: string;
  filterVars?: { key: string; value: string }[];
}

const modelRecordCount = async ({
  model: { name: modelName },
  filter,
  filterVars,
}: ModelRecordCountParams): Promise<{ result: string | number }> => {
  return {
    result: await queryRecords(modelName, {
      filter,
      filterVars,
      take: 1,
      count: true,
    }),
  };
};

export default modelRecordCount;
