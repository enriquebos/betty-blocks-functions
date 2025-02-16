declare type Sort = {
  field?: string;
  order?: "ASC" | "DESC";
  relation?: Record<string, "ASC" | "DESC" | NestedSort>;
};

declare type NestedSort = {
  [key: string]: "ASC" | "DESC" | NestedSort;
};

declare type FieldType =
  | NumberConstructor
  | StringConstructor
  | BooleanConstructor
  | DateConstructor
  | FieldObject;

declare interface FieldObject {
  [key: string]: FieldType | FieldObject;
}

declare interface QueryOptionalOptions {
  skip?: number;
  sort?: Sort;
  take?: number;
  where?: object;
}
