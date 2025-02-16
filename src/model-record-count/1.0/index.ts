import { formatStringMap } from "../../utils/utilityFuncs";
import { gqlRequest } from "../../utils/graphql/utils";

async function gqlQuery(
  modelName: string,
  // @ts-ignore
  options,
): Promise<Object[] | number> {
  const {
    filter = "",
    filterVars = [],
    take = 50,
    skip = 0,
    bodyQuery = "",
    count = false,
  } = options;

  if (count === false && !bodyQuery) {
    throw new Error("No bodyQuery has been provided");
  }

  const where = filter
    ? `where: { ${formatStringMap(filter, filterVars)} }, `
    : "";
  const skipFmt = count ? "" : `, skip: ${skip}`;
  const generateQuery = `query {
    all${modelName} (${where}take: ${count ? 1 : take}${skipFmt}) {
      ${count ? "totalCount" : `results { ${bodyQuery} }`}
    }
  }`;

  const data: Record<string, any> = await gqlRequest(generateQuery);

  return (
    data as { [key: string]: { totalCount?: number; results?: Object[] } }
  )[`all${modelName}`][count ? "totalCount" : "results"];
}

interface ModelRecordCountParams {
  model: { name: string };
  filter?: string;
  filterVars?: { key: string; value: string }[];
}

const modelRecordCount = async ({
  model: { name: modelName },
  ...params
}: ModelRecordCountParams): Promise<{ result: Object | number }> => ({
  result: await gqlQuery(modelName, { ...params, count: true }),
});

export default modelRecordCount;
