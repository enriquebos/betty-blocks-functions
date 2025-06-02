const resolveLazyCollection = async ({ collection: { data } }: any) => {
  return { resolved: Array.from(data) };
};

export default resolveLazyCollection;
