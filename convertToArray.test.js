const convertToArray = require("./convertToArray");

test("returns an array", () => {
  const result = convertToArray("1,2");
  expect(Array.isArray(result)).toBe(true);
});

test("returns an array of strings with no spaces at either end of string", () => {
  const result = convertToArray("Like a Rolling Stone , Tombstone Blues");
  const regex = /^[a-zA-Z][a-zA-Z0-9\s']*?[a-zA-Z0-9]$/;
  console.log(result);
  result.forEach((item) => {
    expect(regex.test(item)).toBeTruthy();
  });
});

test("removes any numbers at the start of the strings", () => {
  const result = convertToArray("1. Like a Rolling Stone , 2. Tombstone Blues");
  const regex = /^[a-zA-Z][a-zA-Z0-9\s']*?[a-zA-Z0-9]$/;
  console.log(result);
  result.forEach((item) => {
    expect(regex.test(item)).toBeTruthy();
  });
});
