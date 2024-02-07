import {
  SchemaCollectionDetail,
  SchemaCollection,
  Query,
  APIItem,
} from '../types';
import {
  getSpaces,
  getApiComment,
  getSimpleComment,
  addSchemaStr,
  getApiName,
  getQueryName,
} from '../common';
import { getRootSchema } from '../store';

export function findModel(ref: string): SchemaCollectionDetail | null {
  if (!ref) {
    return null;
  }

  const schemaCollection = getRootSchema();

  // 只找entity vo dto的数据
  const target = schemaCollection
    .filter((val) => {
      return (
        val.description.includes('entity') ||
        val.description.includes('vo') ||
        val.description.includes('dto')
      );
    })
    .find((val) => val.id === ref);

  if (!target) {
    return null;
  }
  return target;
}

// 目标是解析成下面这样的形式，注释、类型
// interface Department {
//   id: number | null;
// }
export function parseSchema(
  name: string | undefined,
  schema: SchemaCollection | undefined,
): string {
  if (!schema) {
    return '';
  }
  // 这里只考虑 type: 'object'的情况
  if (schema.type !== 'object') {
    return '';
  }

  let str = '';
  str += `export interface ${name} {\n`;
  for (const [key, value] of Object.entries(schema.properties)) {
    const description = (value as any)?.description ?? '';
    if (description) {
      str += getSimpleComment(description, 2);
    }

    const typeString = (value as any)?.type
      ? (value as any)?.type.join(' | ')
      : 'any | unknown | null';
    let define = `${getSpaces(2)}${key}: ${typeString};\n`;
    define = define.replace('integer', 'number');
    define = define.replace('array', 'Array<T>');
    str += define;
  }
  str += `}\r\n`;
  return str;
}

/**
 * @description Get方法的请求参数没有被封装，所以需要封装
 *              不支持path传参的情况
 * @param queryList 请求参数列表
 */
export function parseGetParam(controllerName: string, item: APIItem) {
  const queryList = item.api.parameters.query;

  // 没有参数的情况
  if (queryList.length <= 0) {
    return;
  }

  const queryName = getQueryName(item);

  let str = '';
  str += `export interface ${queryName} {\n`;
  queryList.forEach((query) => {
    str += parseParamSchema(query);
  });
  str += `}\r\n`;

  addSchemaStr(controllerName, str);

  return str;
}

/**
 * @description delete方法的请求参数没有被封装，所以需要封装
 * @param queryList 请求参数列表
 */
export function parseDeleteParam(controllerName: string, item: APIItem) {
  const queryList = item.api.parameters.query;

  let str = '';
  str += `export interface DeleteDto {\n`;
  queryList.forEach((query) => {
    str += parseParamSchema(query);
  });
  str += `}\r\n`;

  addSchemaStr(controllerName, str);

  return str;
}

export function parseParamSchema(query: Query) {
  let str = '';
  const name = query.name;
  const description = query.description;
  const type = query.type;
  // 注释部分
  str += getSimpleComment(description, 2);
  // 声明部分
  let define = `${getSpaces(2)}${name}: ${type};\n`;
  define = define.replace('integer', 'number');
  define = define.replace('array', 'Array<T>');
  str += define;
  return str;
}
