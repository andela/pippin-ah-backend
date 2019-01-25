export default (rawString) => {
  const slug = rawString.toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s/g, '-');

  return slug;
};
