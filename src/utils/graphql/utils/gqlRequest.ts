export default async function gqlRequest<T>(
  operation: string,
  input: {
    input?: T | T[];
    id?: number;
    where?: object;
    uniqueBy?: string[];
    validationSets?: string[];
  } = {},
): Promise<T> {
  if (operation.length > 4194304) {
    throw new Error(`GraphQL request length exceeds maximum allowed size (${operation.length} vs 4194304)`);
  }

  // @ts-ignore | @ts-expect-error: Cannot find name 'gql'
  const { data, errors } = await gql(operation, input);

  if (errors) {
    throw errors;
  }

  return data;
}
