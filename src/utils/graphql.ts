interface QueryOptionalOptions {
  filter?: string;
  take?: number;
  skip?: number;
  bodyQuery?: string;
  count?: boolean;
}

export async function queryRecords(
  modelName: string,
  options: QueryOptionalOptions,
): Promise<string> {
  const {
    filter = "",
    take = 200,
    skip = 0,
    bodyQuery = "",
    count = false,
  } = options;

  if (count === false && !bodyQuery) {
    throw new Error("No bodyQuery has been provided");
  }

  const where = filter ? `where: { ${filter} }, ` : "";
  const skip_fmt = count ? "" : `, skip: ${skip}`;

  const generateQuery = `query {
      all${modelName} (${where}take: ${count ? 1 : take}${skip_fmt}) {
        ${count ? "totalCount" : `results { ${bodyQuery} }`}
      }
    }`;

  // @ts-expect-error: Cannot find name 'gql'
  const { data, errors } = await gql(generateQuery);

  if (errors) {
    throw errors;
  }

  return data[`all${modelName}`][count ? "totalCount" : "results"];
}
