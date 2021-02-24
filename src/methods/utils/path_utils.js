export const getByPath = (object, path) => {
  if (!path) {
    return;
  }

  return path.split(".").reduce((acc, value) => acc[value], object);
};

export const getProp = (object, path, defaultValue) => {
  if (!path) {
    return object;
  }

  const normalizedPath = Array.isArray(path)
    ? path
    : path.split(".").filter((item) => item.length);

  if (!normalizedPath.length) {
    return object === undefined ? defaultValue : object;
  }

  return getProp(object[normalizedPath.shift()], normalizedPath, defaultValue);
};
