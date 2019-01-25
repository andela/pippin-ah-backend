export default (text) => {
  const wordCount = text.match(/\S+/g).length;
  const readTime = Math.floor(wordCount / 275);
  return readTime || 1;
};
