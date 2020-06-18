export function trim(object: Record<string, any>) {
  for (const key in object) {
    if (typeof object[key] === 'undefined') {
      delete object[key];
    }
    if (object[key] === null) {
      delete object[key];
    }
  }
}

export function convertStringToSankecase(str: string) {
  const upperCaseMap = new Map();
  const strArray = Array.from(str);
  strArray.forEach((char, index) => {
    const currentCharCode = char.charCodeAt(0);
    const asciiCodeA = 'A'.charCodeAt(0);
    const asciiCodeZ = 'Z'.charCodeAt(0);
    if (currentCharCode >= asciiCodeA && currentCharCode <= asciiCodeZ) {
      upperCaseMap.set(index, char);
    }
  });
  upperCaseMap.forEach((value, key) => {
    strArray[key] = `_${value.toLowerCase()}`;
  });
  return strArray.join('');
}

export function convertParamsToSankecase<T>(params: T) {
  return Object.keys(params).reduce((prev: Record<string, any>, key: string) => {
    const currentParams = prev;
    const snakecaseKey = convertStringToSankecase(key);
    currentParams[snakecaseKey] = (params as any)[key];
    return currentParams;
  }, {});
}
