function convertToArray(string) {
  return string.split(",").map((item) => {
    return item.trim();
  });
}

module.exports = convertToArray;
