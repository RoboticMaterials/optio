export const valueExistInSelected = (value, values, props) =>
  !!values.find((val) => getByPath(val, props['valueField']) === value);

export const hexToRGBA = (hex, alpha) => {
  const RR = parseInt(hex.slice(1, 3), 16);
  const GG = parseInt(hex.slice(3, 5), 16);
  const BB = parseInt(hex.slice(5, 7), 16);

  return `rgba(${RR}, ${GG}, ${BB}${alpha && `, ${alpha}`})`;
};

export const debounce = (fn, delay = 0) => {
  let timerId;

  return (...args) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
};

export const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export const getByPath = (object, path) => {
  // console.log('getByPath: {object, path}', {object, path})

  let new_path = path.split('.')
  // console.log('getByPath: new_path', {new_path})

  if (!path) {
    return;
  }

  return path.split('.').reduce((acc, value) => acc[value], object)
};

export const getProp = (object, path, defaultValue) => {
  if (!path) {
    return object;
  }

  const normalizedPath = Array.isArray(path) ? path : path.split('.').filter((item) => item.length);

  if (!normalizedPath.length) {
    return object === undefined ? defaultValue : object;
  }

  return getProp(object[normalizedPath.shift()], normalizedPath, defaultValue);
};
