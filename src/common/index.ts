import { findModel, parseSchema } from '../parse/parseInterface';
import {
  getRootSchema,
  getSchemaMapWithController,
  setSchemaMap,
} from '../store';
import { APIItem, SchemaCollectionDetail } from '../types';

/**
 * 生成空格字符串
 * @param num 空格数量
 * @returns 空格字符串
 */
export function getSpaces(num: number) {
  if (!num) {
    return '';
  }
  return ' '.repeat(num);
}

/**
 * 注释
 * @param name
 * @param description
 * @returns
 */
export function getApiComment(
  name: string,
  description: string,
  space: number,
) {
  // 缩进
  const spaces = getSpaces(space);

  let str = '';
  str += `${spaces}/** \n`;
  str += `${spaces}* @name ${name}\n`;
  str += `${spaces}* @description ${description}\n`;
  str += `${spaces}*/ \n`;

  return str;
}

/**
 * 获取简单的注释
 * @param name
 * @param description
 * @returns
 */
export function getSimpleComment(description: string, space: number) {
  // 缩进
  const spaces = getSpaces(space);

  let str = '';
  str += `${spaces}// ${description}\n`;

  return str;
}

/**
 * path转方法名
 * @param path
 * @returns
 */
export function getApiName(path: string) {
  // 默认都是有两级的例如 /depatment/page
  const list = path.split('/');
  const last = list[list.length - 1];
  const middle = list[list.length - 2];
  const firstChar = last.charAt(0);
  const capitalizedStr = firstChar.toUpperCase() + last.slice(1);

  return middle + capitalizedStr;
}

/**
 * 替换不对的字符
 * @param str
 * @returns
 */
export function trimChar(str: string) {
  str = str.replace(/«/g, '<');
  str = str.replace(/»/g, '>');

  return str;
}

/**
 * 获取模型的名称
 * @param model
 * @returns
 */
export function getModelName(model: SchemaCollectionDetail | null) {
  if (!model || !model.name) {
    return 'any';
  }
  let name = model.name;
  name = trimChar(name);
  return name;
}

/**
 * 获取请求体的schema
 * @param item
 * @param schemaCollection
 */
export function getReqModel(controllerName: string, item: APIItem) {
  const reqRef = item.api.requestBody.jsonSchema?.$ref;
  const reqmodel = findModel(reqRef);

  const str = parseSchema(reqmodel?.name, reqmodel?.schema.jsonSchema);
  addSchemaStr(controllerName, str);
  return reqmodel;
}

/**
 * 获取请求体的schema的name
 * @param item
 * @param schemaCollection
 */
export function getReqModelName(controllerName: string, item: APIItem) {
  const reqmodel = getReqModel(controllerName, item);
  const reqModelName = getModelName(reqmodel);
  return reqModelName;
}

/**
 * 获取返回体的schema
 * @param item
 * @param schemaCollection
 */
export function getResModel(controllerName: string, item: APIItem) {
  const resRef = item.api.responses[0].jsonSchema.$ref;
  const resmodel = findModel(resRef);

  const str = parseSchema(resmodel?.name, resmodel?.schema.jsonSchema);
  addSchemaStr(controllerName, str);

  return resmodel;
}

/**
 * 获取返回体的schema的name
 * @param item
 * @param schemaCollection
 * @returns
 */
export function getResModelName(controllerName: string, item: APIItem) {
  const schemaCollection = getRootSchema();
  const resmodel = getResModel(controllerName, item);
  const resModelName = getModelName(resmodel);
  return resModelName;
}

/**
 * 构建请求方法
 * @param item 请求ApiItem
 * @param method 方法名称
 * @param reqModelName 请求的实体
 * @param resModelName 返回的实体
 * @returns
 */
export function getApiString(
  item: APIItem,
  method: string,
  reqModelName: string,
  resModelName: string,
) {
  let str = '';
  // 注释
  const name = item.name;
  const description = item.api.description ?? '';
  str += getApiComment(name, description, 0);

  const functioName = getApiName(item.api.path);
  str += `export function ${functioName}(params: ${reqModelName}) {\n`;
  str += `${getSpaces(2)}return defHttp.${method}<`;
  str += `${resModelName}>(\n`;
  const url = item.api.path;
  str += `${getSpaces(4)}{url: '${url}', params}\n`;
  str += `${getSpaces(2)})\n}`;
  str += `\n\r`;
  return str;
}

/**
 * 获取请求实体的名称
 * @param item
 */
export function getQueryName(item: APIItem) {
  const name = getApiName(item.api.path) + 'QueryDto';
  const firstChar = name.charAt(0);
  const capitalizedStr = firstChar.toUpperCase() + name.slice(1);
  return capitalizedStr;
}

export function addSchemaStr(controllerName: string, str: string) {
  if (!str) return;
  let orginStr = getSchemaMapWithController(controllerName)
    ? getSchemaMapWithController(controllerName)
    : '';
  orginStr += str;

  // 存在重复添加的情况
  setSchemaMap(controllerName, orginStr);
}
