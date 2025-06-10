export declare interface CreateOrUpdateRecordParams {
  cuRecord: {
    data?: Record<string, unknown>;
    model: {
      name: string;
    };
  };
  mapping: MappingItem[];
  mappingCreate: MappingItem[];
  mappingUpdate: MappingItem[];
  validates?: boolean;
}

export declare interface RandomNumberOptions {
  min?: number;
  max?: number;
}

export declare interface TokenParams {
  tokenEndpoint: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  grantType: string | "authorization_code" | "refresh_token";
  code: string;
}

export declare interface DeleteAllParams {
  model: {
    name: string;
  };
  amountToDelete: number;
  batchSize: number;
  filter: string;
  filterVars: MappingItem[];
}
