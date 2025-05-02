const compareArray = (a, b) => {
  if (JSON.stringify(a) < JSON.stringify(b)) {
    return -1;
  }
  if (JSON.stringify(a) > JSON.stringify(b)) {
    return 1;
  }
  return 0;
}

const sortObject = (unorderedObject) => {
  if (!unorderedObject) {
    if (typeof unorderedObject === "object") {
      return {};
    }
    if (Object.prototype.toString.call(unorderedObject) === '[object Array]') {
      return [];
    }
  }
  if (typeof unorderedObject === "object") {
    let result= {};
    let keys = Object.keys(unorderedObject);
    for (let i = 0; i < keys.length; i++) {
      if (typeof unorderedObject[keys[i]] === "object" || Object.prototype.toString.call(unorderedObject[keys[i]]) === '[object Array]') {
        result[keys[i]] = sortObject(unorderedObject[keys[i]]);
      } else {
        result[keys[i]] = unorderedObject[keys[i]];
      }
    }
    return keys.sort().reduce(
      (obj, key) => {
        obj[key] = result[key];
        return obj;
      },
      {}
    );
  } else if (Object.prototype.toString.call(unorderedObject) === '[object Array]') {
    let result= [];
    for (let i = 0; i < unorderedObject.length; i++) {
      if (typeof unorderedObject[i] === "object" || Object.prototype.toString.call(unorderedObject[i]) === '[object Array]') {
        result[i] = sortObject(unorderedObject[i]);
      } else {
        result[i] = unorderedObject[i];
      }
    }
    return result.sort(compareArray);
  } else {
    return unorderedObject;
  }
}

export default sortObject;