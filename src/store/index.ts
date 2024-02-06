import { ApiCollectionItem, SchemaCollectionDetail } from '../types';

let rootItems: ApiCollectionItem[] = [];
let schemaCollection: SchemaCollectionDetail[] = [];

const codeMap = new Map();
const apiMap = new Map();
const schemaMap = new Map();

export function setRootAPI(value: ApiCollectionItem[]) {
  rootItems = value;
}

export function getRootAPI() {
  return rootItems;
}

export function setRootSchema(value: SchemaCollectionDetail[]) {
  schemaCollection = value;
}

export function getRootSchema() {
  return schemaCollection;
}

export function setCodeMap(controller: string, code: string) {
  codeMap.set(controller, code);
}
export function getCodeMap() {
  return codeMap;
}
export function getCodeString() {
  let str = '';

  codeMap.forEach((value: string, key: string) => {
    str += value;
    str += `\n\r`;
    str += '****************************************';
    str += `\n\r`;
  });

  return str;
}

export function setApiMap(controller: string, api: string) {
  apiMap.set(controller, api);
}

export function getApiMap() {
  return apiMap;
}

export function setSchemaMap(controller: string, schema: string) {
  schemaMap.set(controller, schema);
}
export function getSchemaMapWithController(controller: string) {
  return schemaMap.get(controller);
}
export function getSchemaMap() {
  return schemaMap;
}
