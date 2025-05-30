import { modelCount } from "../../utils/graphql/exts";
import { whereToObject } from "../../utils/graphql/utils";
import { formatStringMap } from "../../utils/utilityFuncs";

interface ModelRecordCountParams {
  model: { name: string };
  filter?: string;
  filterVars?: { key: string; value: string }[];
}

const modelRecordCount = async ({
  model: { name },
  filter,
  filterVars,
}: ModelRecordCountParams): Promise<{ result: object | number }> => ({
  result: await modelCount(name, { where: whereToObject(formatStringMap(filter, filterVars)) }),
});

export default modelRecordCount;
