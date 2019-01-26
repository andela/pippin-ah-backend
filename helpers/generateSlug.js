export default (rawString) => {
  const slug = rawString.trim().toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s/g, '-');

  return slug;
};
