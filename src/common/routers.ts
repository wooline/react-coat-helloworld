import * as assignDeep from "deep-extend";

// 排除默认路由参数，路由中如果参数值与默认参数相同可以不传，以缩短路由长度
function excludeDefData<A extends {[key: string]: any}>(data: A, def: A): A | undefined {
  const result: any = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (typeof data[key] === "object" && def[key] && !Array.isArray(def[key])) {
        result[key] = excludeDefData(data[key], def[key]);
      } else if (data[key] !== def[key]) {
        result[key] = data[key];
      }
    }
  }
  if (Object.keys(result).length === 0) {
    return undefined;
  }
  return result;
}
// 合并默认路由参数，如果路由中某参数没传，将用默认值替代，与上面方法互逆
export function mergeDefData<A extends {[key: string]: any}>(data: A, def: A): A {
  return assignDeep({}, def, data);
}

// 将路由参数序列化为 JSON 字串
export function stringifyQuery<A>(key: string, args: A, def: A): string {
  let data: any = args;
  if (args && def) {
    data = excludeDefData(args, def);
  }
  return data ? key + "=" + escape(JSON.stringify(data)) : "";
}

export function toUrl(pathname: string, search?: string, hash?: string): string {
  let url = pathname;
  if (search) {
    url += "?" + search.replace("?", "");
  }
  if (hash) {
    url += "#" + hash.replace("#", "");
  }
  return url;
}

// 将JSON字串解析为数据，与以上方法互逆
export function parseQuery<A extends {[key: string]: any}>(key: string, search: string, defArgs: A): A {
  const str = key + "=";
  let [, query] = search.split(str);
  if (query) {
    query = query.split("&")[0];
  }
  if (query) {
    const args = JSON.parse(unescape(query));
    if (defArgs) {
      return mergeDefData(args, defArgs);
    } else {
      return args;
    }
  } else {
    return defArgs;
  }
}

export function isForceRefresh(hash: string): boolean | null {
  if (hash.indexOf("refresh=true") > -1) {
    return true;
  } else if (hash.indexOf("refresh=false") > -1) {
    return false;
  } else {
    return null;
  }
}
