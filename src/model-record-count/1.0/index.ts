import { queryRecords } from "../../utils/graphql";

interface ModelRecordCountParams {
  model: { name: string };
  filter?: string;
  filterVars?: { key: string; value: string }[];
}

const modelRecordCount = async ({
  model: { name: modelName },
  ...params
}: ModelRecordCountParams): Promise<{ result: string | number }> => ({
  result: await queryRecords(modelName, { ...params, count: true }),
});

export default modelRecordCount;
