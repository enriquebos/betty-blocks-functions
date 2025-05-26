function transformData(input: MappingItem[]): Record<string, any> {
  return input.reduce(
    (acc, { key, value }) => {
      const keyName = key[0]?.name;
      if (keyName) acc[keyName] = value;
      return acc;
    },
    {} as Record<string, any>
  );
}

function mergeAndUpdate(source: any, target: any, flipUpdate: boolean = false): any {
  return Object.keys(source).reduce(
    (acc, key) => (key in acc ? { ...acc, [key]: flipUpdate ? target[key] : source[key] } : acc),
    { ...target }
  );
}

type MappingItem = {
  key: Array<{
    kind: string;
    name: string;
  }>;
  value: any;
};

type CreateOrUpdateRecordParams = {
  cuRecord: {
    data?: Record<string, any>;
    model: {
      name: string;
    };
  };
  mapping: MappingItem[];
  mappingCreate: MappingItem[];
  mappingUpdate: MappingItem[];
  validates: boolean;
};

export async function createOrUpdateRecord({
  cuRecord: {
    data: recordObject,
    model: { name: modelName },
  },
  mapping,
  mappingCreate,
  mappingUpdate,
  validates = true,
}: CreateOrUpdateRecordParams): Promise<object> {
  const isUpdate = Boolean(recordObject);
  const mutationName = isUpdate ? `update${modelName}` : `create${modelName}`;
  const mutation = `mutation {
  ${mutationName}(input: $input${isUpdate ? ", id: $id" : ""}) {
      id
    }
  }`;

  const formattedInput = transformData(mapping);
  const input = mergeAndUpdate(
    transformData(isUpdate ? mappingUpdate : mappingCreate),
    isUpdate ? mergeAndUpdate(recordObject, formattedInput, true) : formattedInput
  );

  // @ts-expect-error: gql undefined
  const { data, errors } = await gql(mutation, {
    input,
    ...(isUpdate && { id: recordObject.id }),
    validationSets: validates ? ["default"] : ["empty"],
  });

  if (errors) throw errors;

  return {
    as: { ...data[mutationName], ...input },
  };
}

export default createOrUpdateRecord;
