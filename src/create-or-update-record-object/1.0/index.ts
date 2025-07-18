import { transformData, mergeAndUpdate } from "../../utils";
import { createOrUpdateRecord } from "../../utils/graphql/exts";
import type { CreateOrUpdateRecordParams } from "../../types/functions";

export async function createOrUpdateRecordObject({
  cuRecord: {
    data: recordObject,
    model: { name: modelName },
  },
  mapping,
  mappingCreate,
  mappingUpdate,
  validates = true,
}: CreateOrUpdateRecordParams): Promise<Record<string, unknown>> {
  const isUpdate = Boolean(recordObject);
  const baseInput = transformData(mapping);
  const operationSpecificInput = transformData(isUpdate ? mappingUpdate : mappingCreate);
  const safeRecordObject = recordObject ?? {};
  const input = isUpdate
    ? mergeAndUpdate(operationSpecificInput, mergeAndUpdate(safeRecordObject, baseInput, true))
    : { ...baseInput, ...operationSpecificInput };

  return { as: await createOrUpdateRecord(modelName, safeRecordObject, input, validates) };
}

export default createOrUpdateRecordObject;
