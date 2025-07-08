interface Collection {
  data: Iterable<object>;
}

interface ResolveLazyCollectionParams {
  collection: Collection;
}

const resolveLazyCollection = async ({ collection: { data } }: ResolveLazyCollectionParams) => {
  return { resolved: Array.from(data) };
};

export default resolveLazyCollection;
