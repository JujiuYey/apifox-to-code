import {
  setRootAPI,
  setRootSchema,
  getRootAPI,
  getCodeString,
  getCodeMap,
  setCodeMap,
  getApiMap,
  getSchemaMap,
} from './store';
import { LoadData } from './types';
import { startParseApi } from './parse/parseApi';

export function loadData(data: LoadData) {
  // 根目录下的数据
  const apiCollection = data.apiCollection;
  const rootApi = apiCollection[0].items;
  setRootAPI(rootApi);

  const schemaCollection = data.schemaCollection;
  const rootSchema = schemaCollection[0].items;
  setRootSchema(rootSchema);

  return start();
}

function start() {
  startParseApi();

  const controllers = getRootAPI().map((item) => item.name);
  let codeMap = getCodeMap();
  const schemaMap = getSchemaMap();
  console.log('🚀 ~ start ~ schemaMap:', schemaMap);
  const apiMap = getApiMap();
  controllers.forEach((item) => {
    if (!codeMap.has(item)) {
      const schema = schemaMap.get(item);
      const api = apiMap.get(item);

      const codeString = schema + `\n\r` + api;
      setCodeMap(item, codeString);
    }
  });

  const code = getCodeString();
  codeMap = getCodeMap();

  return {
    schemaMap,
    apiMap,
    code,
    codeMap,
    controllers,
  };
}
