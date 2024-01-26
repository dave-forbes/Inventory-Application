function convertToArray(string) {
  return string.split(",").map((item) => {
    while (!/[a-zA-Z]/.test(item[0])) {
      item = item.slice(1);
    }
    return item.trim();
  });
}

module.exports = convertToArray;
