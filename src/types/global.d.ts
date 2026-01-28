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

declare module "../../utils/crypto/hmac-sha1.min.js" {
  const CryptoJS: any;
  export default CryptoJS;
}

declare module "*.min.js" {
  const anyModule: any;
  export default anyModule;
}
