export default (value = '') => {
  if (!Array.isArray(value)) return [value.toString()];
  return value;
};
