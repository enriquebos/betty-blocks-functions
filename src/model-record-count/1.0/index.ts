import { queryRecords } from "../../utils/graphql";

interface Model {
  name: string;
}

interface ModelRecordCountParams {
  model: Model;
  filter?: string;
  filterVars?: { key: string; value: string }[];
}

interface QueryOptionalOptions {
  filter?: string;
  filterVars?: { key: string; value: string }[];
  take?: number;
  skip?: number;
  bodyQuery?: string;
  count?: boolean;
}

const modelRecordCount = async ({
  model: { name: modelName },
  filter,
  filterVars,
}: ModelRecordCountParams): Promise<{ result: string }> => {
  const queryOptions: QueryOptionalOptions = {
    filter,
    filterVars,
    take: 1,
    skip: 0,
    bodyQuery: "id",
    count: true,
  };

  const modelCount = await queryRecords(modelName, queryOptions);

  return {
    result: modelCount,
  };
};

export default modelRecordCount;
