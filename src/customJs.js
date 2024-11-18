/**
 * @param {String} mainString - Data from database to be checked
 * @param {String} checkString - String that is inputted by user to check data
 */
export function containsAllChars(mainString, checkString) {
  const charCount = {};
  for (const char of checkString) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  for (const char of mainString) {
    if (charCount[char]) {
      charCount[char]--;
    }
  }

  for (const count of Object.values(charCount)) {
    if (count > 0) {
      return false; // A character from checkString is missing
    }
  }

  return true; // All characters from checkString are present
}