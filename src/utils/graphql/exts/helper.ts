import {
  mutationCreate,
  mutationDelete,
  mutationUpdate,
  mutationUpsert,
  mutationCreateMany,
  mutationDeleteMany,
  mutationUpdateMany,
  mutationUpsertMany,
  queryOne,
  queryAll,
} from "../";
import { modelCount } from "../exts";

export default class GraphqlModel {
  modelName: string;
  massMutate: boolean;
  _log_request: boolean;

  constructor(modelName: string, massMutate: boolean = false, _log_request: boolean = false) {
    this.modelName = modelName;
    this.massMutate = massMutate;
    this._log_request = _log_request;
  }

  async queryOne<T>(options: {
    fields: Partial<Record<keyof T, any>>;
    queryArguments?: {
      where?: object;
    };
    _log_request?: boolean;
  }): Promise<T> {
    return (await queryOne<T>(this.modelName, options)) as T;
  }

  async queryAll<T>(options: {
    fields: Partial<Record<keyof T, any>>;
    queryArguments?: {
      skip?: number;
      sort?: Sort;
      take?: number;
      where?: object;
      totalCount?: boolean;
    };
    _log_request?: boolean;
  }): Promise<{ totalCount: number; data: T[] }> {
    return await queryAll<T>(this.modelName, options);
  }

  async modelCount(where: object = {}): Promise<number> {
    return await modelCount(this.modelName, where);
  }

  async mutationCreate(record: object): Promise<number> {
    return await mutationCreate(this.modelName, record);
  }

  async mutationDelete(id: number): Promise<number> {
    return await mutationDelete(this.modelName, id, this._log_request);
  }

  async mutationUpdate(id: number, partialRecord: object): Promise<number> {
    return await mutationUpdate(this.modelName, id, partialRecord, this._log_request);
  }

  async mutationUpsert(record: object, uniqueBy: string[]): Promise<number> {
    return await mutationUpsert(this.modelName, record, uniqueBy, this._log_request);
  }

  async mutationCreateMany(records: object[]): Promise<number[]> {
    return await mutationCreateMany(this.modelName, records, this._log_request);
  }

  async mutationDeleteMany(ids: number[]): Promise<number[]> {
    return await mutationDeleteMany(this.modelName, ids, this._log_request);
  }

  async mutationUpdateMany(partialRecord: object, where: object = {}): Promise<number[]> {
    return await mutationUpdateMany(this.modelName, partialRecord, { where: where, _log_request: this._log_request });
  }

  async mutationUpsertMany(records: object[]): Promise<number[]> {
    return await mutationUpsertMany(this.modelName, records, this._log_request);
  }
}
