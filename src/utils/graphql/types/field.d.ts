declare interface FieldObject {
  [key: string]: FieldType | FieldObject;
}

declare type FieldType = NumberConstructor | StringConstructor | BooleanConstructor | DateConstructor | FieldObject;
