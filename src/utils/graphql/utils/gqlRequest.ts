export default async function gqlRequest<T = object>(
  operation: string,
  input: object = {},
): Promise<T> {
  // @ts-expect-error: Cannot find name 'gql'
  const { data, errors } = await gql(operation, input);

  if (errors) {
    throw errors;
  }

  return data as T;
}
