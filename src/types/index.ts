// 数据模型
export interface SchemaCollection {
  type: string;
  properties: any;
  'x-apifox-orders': string[];
}

export interface SchemaCollectionDetail {
  name: string;
  displayName: string;
  id: string;
  description: string;
  schema: {
    jsonSchema: SchemaCollection;
  };
}

export interface SchemaCollectionItem {
  name: string;
  items: SchemaCollectionDetail[];
}

// api接口
export interface Query {
  name: string;
  required: boolean;
  description: string;
  type: string;
  id: string;
}

export interface Parameters {
  path: any[]; // 基本不会用到path传参的方式，所以不判断
  query: Query[];
  cookie: any[];
  header: [];
}

export interface Responses {
  id: string;
  name: string;
  code: number;
  contentType: string;
  jsonSchema: {
    $ref: string;
    description: string;
  };
}

export interface RequestBody {
  type: string;
  parameters: any[];
  jsonSchema: {
    $ref: string;
    description: string;
  };
}

export interface ApiInterface {
  id: string;
  method: string;
  path: string;
  parameters: Parameters;
  responses: Responses[];
  requestBody: RequestBody;
  description: string;
}

export interface APIItem {
  name: string;
  api: ApiInterface;
}

export interface ApiCollectionItem {
  name: string;
  description: string;
  auth: any;
  parentId: number;
  serverId: string;
  identityPattern: any;
  preProcessors: any;
  postProcessors: any;
  inheritPostProcessors: any;
  inheritPreProcessors: any;
  items: APIItem[];
}

export interface ApiCollectionEntry {
  name: string;
  auth: any;
  parentId: number;
  serverId: string;
  description: string;
  identityPattern: any;
  preProcessors: any;
  postProcessors: any;
  inheritPostProcessors: any;
  inheritPreProcessors: any;
  items: ApiCollectionItem[];
}

// 传入的数据
export interface LoadData {
  apiCollection: ApiCollectionEntry[];
  schemaCollection: SchemaCollectionItem[];
}
