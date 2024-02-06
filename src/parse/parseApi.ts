import { APIItem, ApiCollectionItem, ApiInterface } from '../types';
import { parseDeleteParam, parseGetParam } from './parseInterface';
import { getResModelName, getApiString, getReqModelName } from '../common';
import {
  getRootAPI,
  getRootSchema,
  setApiMap,
  setRootAPI,
  setRootSchema,
} from '../store';

// controller 对应是 ApiCollectionItem
export function startParseApi(): void {
  const controllers = getRootAPI();

  controllers.forEach((controller) => {
    setApiMap(
      controller.name,
      parseController(controller.name, controller.items),
    );
  });
}

/**
 * 解析 Controller 下的每个方法
 * @param items
 */
export function parseController(controllerName: string, items: APIItem[]) {
  let str = '';
  items.forEach((api) => {
    // 解析每个方法
    str += parseApiItem(controllerName, api);
  });

  return str;
}

/**
 * 解析apiItem,
 * @param item
 * @param schemaCollection
 * @returns
 */
export function parseApiItem(controllerName: string, item: APIItem) {
  let str = '';

  // 根据方法进行参数和返回值的判断
  const method = item.api.method;
  if (method === 'get') {
    str += parseGet(controllerName, item);
  } else if (method === 'post') {
    str += parsePOST(controllerName, item);
  } else if (method === 'put') {
    str += parsePUT(controllerName, item);
  } else if (method === 'delete') {
    str += parseDelete(controllerName, item);
  }
  return str;
}

export function parseGet(controllerName: string, item: APIItem) {
  parseGetParam(controllerName, item);
  const resModelName = getResModelName(controllerName, item);
  return getApiString(item, 'get', 'QueryDto', resModelName);
}

export function parsePOST(controllerName: string, item: APIItem) {
  const reqModelName = getReqModelName(controllerName, item);
  const resModelName = getResModelName(controllerName, item);
  return getApiString(item, 'post', reqModelName, resModelName);
}

export function parsePUT(controllerName: string, item: APIItem) {
  const reqModelName = getReqModelName(controllerName, item);
  const resModelName = getResModelName(controllerName, item);
  return getApiString(item, 'put', reqModelName, resModelName);
}

export function parseDelete(controllerName: string, item: APIItem) {
  // 请求参数interface
  const query = item.api.parameters.query;
  parseDeleteParam(controllerName, item);
  const resModelName = getResModelName(controllerName, item);
  return getApiString(item, 'delete', 'DeleteDto', resModelName);
}
