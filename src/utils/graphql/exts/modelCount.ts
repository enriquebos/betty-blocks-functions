import { gqlRequest, whereToString } from "../utils";

export default async function modelCount(modelName: string, where: object = {}): Promise<number> {
  const response = (await gqlRequest(
    `query { all${modelName}${Object.keys(where).length !== 0 ? `(where: { ${whereToString(where)} })` : ""} { totalCount } }`,
  )) as {
    [key: string]: { totalCount: number };
  };

  return response[`all${modelName}`].totalCount;
}
