import createOrUpdateRecordObject from "../src/create-or-update-record-object/1.0/index";
import { transformData, mergeAndUpdate } from "../src/utils";
import { createOrUpdateRecord } from "../src/utils/graphql/exts";

import type { CreateOrUpdateRecordParams } from "../src/types/functions";
import type { MappingItem } from "../src/types/global";

jest.mock("../src/utils", () => ({
  transformData: jest.fn(),
  mergeAndUpdate: jest.fn(),
}));

jest.mock("../src/utils/graphql/exts", () => ({
  createOrUpdateRecord: jest.fn(),
}));

describe("createOrUpdateRecordObject", () => {
  const mockTransformData = transformData as jest.Mock;
  const mockMergeAndUpdate = mergeAndUpdate as jest.Mock;
  const mockCreateOrUpdateRecord = createOrUpdateRecord as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sampleMappingItem: MappingItem = {
    key: [{ kind: "field", name: "field1" }],
    value: "value1",
  };

  it("should handle create scenario correctly", async () => {
    const baseInput = { base: "data" };
    const createInput = { create: "data" };

    mockTransformData.mockReturnValueOnce(baseInput).mockReturnValueOnce(createInput);

    const expectedInput = { ...baseInput, ...createInput };
    const mockResult = { id: 1, status: "created" };

    mockCreateOrUpdateRecord.mockResolvedValueOnce(mockResult);

    const params: CreateOrUpdateRecordParams = {
      cuRecord: {
        data: undefined,
        model: { name: "TestModel" },
      },
      mapping: [sampleMappingItem],
      mappingCreate: [sampleMappingItem],
      mappingUpdate: [sampleMappingItem],
      validates: true,
    };

    const result = await createOrUpdateRecordObject(params);

    expect(mockTransformData).toHaveBeenCalledTimes(2);
    expect(mockCreateOrUpdateRecord).toHaveBeenCalledWith("TestModel", {}, expectedInput, true);
    expect(result).toEqual({ as: mockResult });
  });

  it("should handle update scenario correctly", async () => {
    const recordObject = { id: 123 };
    const baseInput = { base: "data" };
    const updateInput = { update: "data" };
    const intermediateMerged = { merged: "intermediate" };
    const finalMerged = { final: "merged" };

    mockTransformData.mockReturnValueOnce(baseInput).mockReturnValueOnce(updateInput);
    mockMergeAndUpdate.mockReturnValueOnce(intermediateMerged).mockReturnValueOnce(finalMerged);

    const mockResult = { id: 123, status: "updated" };
    mockCreateOrUpdateRecord.mockResolvedValueOnce(mockResult);

    const params: CreateOrUpdateRecordParams = {
      cuRecord: {
        data: recordObject,
        model: { name: "TestModel" },
      },
      mapping: [sampleMappingItem],
      mappingCreate: [sampleMappingItem],
      mappingUpdate: [sampleMappingItem],
    };

    const result = await createOrUpdateRecordObject(params);

    expect(mockTransformData).toHaveBeenCalledTimes(2);
    expect(mockMergeAndUpdate).toHaveBeenCalledTimes(2);
    expect(mockCreateOrUpdateRecord).toHaveBeenCalledWith("TestModel", recordObject, finalMerged, true);
    expect(result).toEqual({ as: mockResult });
  });
});
