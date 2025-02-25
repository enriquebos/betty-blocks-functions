// @ts-nocheck
import queryOne from "../queryOne";
import queryAll from "../queryAll";
import modelCount from "./modelCount";
import mutationCreate from "../mutationCreate";
import mutationDelete from "../mutationDelete";
import mutationUpdate from "../mutationUpdate";
import mutationUpsert from "../mutationUpsert";
import mutationCreateMany from "../mutationCreateMany";
import mutationDeleteMany from "../mutationDeleteMany";
import mutationUpdateMany from "../mutationUpdateMany";
import mutationUpsertMany from "../mutationUpsertMany";

export default class GraphqlModel {
  modelName: string;
  massMutate: Boolean;

  constructor(modelName: string, massMutate: Boolean = false) {
    this.modelName = modelName;
    this.massMutate = massMutate;
  }

  async queryOne<T>(fields: FieldObject, where: object = {}): Promise<T> {
    return await queryOne(this.modelName, fields, where);
  }

  async queryAll<T>(fields: FieldObject, options: QueryOptionalOptions = {}): Promise<T[]> {
    return await queryAll(this.modelName, fields, options);
  }

  async modelCount(where: object = {}): Promise<number> {
    return await modelCount(this.modelName, where);
  }

  async mutationCreate(record: object): Promise<number> {
    return await mutationCreate(this.modelName, record);
  }

  async mutationDelete(id: number): Promise<number> {
    return await mutationDelete(this.modelName, id);
  }

  async mutationUpdate(id: number, partialRecord: object): Promise<number> {
    return await mutationUpdate(this.modelName, id, partialRecord);
  }

  async mutationUpsert(record: object, uniqueBy: string[]): Promise<number> {
    return await mutationUpsert(this.modelName, record, uniqueBy);
  }

  async mutationCreateMany(records: object[]): Promise<number[]> {
    return await mutationCreateMany(this.modelName, records);
  }

  async mutationDeleteMany(ids: number[]): Promise<number[]> {
    return await mutationDeleteMany(this.modelName, ids);
  }

  async mutationUpdateMany(partialRecord: object, where: object = {}): Promise<number[]> {
    return await mutationUpdateMany(this.modelName, partialRecord, where);
  }

  async mutationUpsertMany(records: object[]): Promise<number[]> {
    return await mutationUpsertMany(this.modelName, records);
  }
}
