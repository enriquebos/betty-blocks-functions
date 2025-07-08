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
  const baseInput = transformData(mapping) as Record<string, unknown>;
  const operationSpecificInput = transformData(isUpdate ? mappingUpdate : mappingCreate) as Record<string, unknown>;
  const safeRecordObject = (recordObject ?? {}) as Record<string, unknown>;
  const input = isUpdate
    ? (mergeAndUpdate(
        operationSpecificInput,
        mergeAndUpdate(safeRecordObject, baseInput, true) as Record<string, unknown>,
      ) as Record<string, unknown>)
    : { ...baseInput, ...operationSpecificInput };

  return { as: await createOrUpdateRecord(modelName, safeRecordObject, input, validates) };
}

export default createOrUpdateRecordObject;
