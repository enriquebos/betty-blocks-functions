declare interface MappingItem {
  key: {
    kind: string;
    name: string;
  }[];
  value: unknown;
}

declare interface Blob {
  buffer(): Promise<ArrayBuffer>;
}

declare module "xlsx/xlsx.mjs" {
  export * from "xlsx";
}
