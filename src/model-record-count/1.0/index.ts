import { modelCount } from "../../utils/graphql/exts";
import { whereToObject } from "../../utils/graphql/utils";
import { replaceTemplateVariables } from "../../utils/templating";

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
  result: await modelCount(name, {
    where: whereToObject(replaceTemplateVariables(filter, filterVars as { key: string; value: string }[])),
  }),
});

export default modelRecordCount;
