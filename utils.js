// Import Node dependencies
const fs = require('fs');

/**
 * Convert any string to Title Case.
 *
 * To convert to tileCase, there are several steps:
 * - Remove excess spaces around words (leave only one)
 * - Convert all words to lower case
 * - Capitalize the first letter of each word
 *
 * @since       1.0.0
 * @access      public
 *
 * @param {string} str  The string to convert.
 *
 * @return {string} A string in Title Case format.
 */
function toTitleCase(str) {
  let niu = '';

  // Remove excess spaces, convert to lowercase and split words
  let words = str.replace(/\s+/g, ' ').trim().toLowerCase().split(' ');
  words.forEach((word) => {
    // Convert first letter to uppercase
    niu += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
  });

  // Remove the space at the end
  return niu.slice(0, -1);
}

/**
 * Write a JSON object to the file system.
 *
 * @since       1.0.0
 * @access      public
 *
 * @param {Object} obj  The JSON object to save.
 * @param {string} path The path of the system file to write to.
 */
function writeJSONToFile(obj, path) {
  // Convert JSON object to a string
  const data = JSON.stringify(obj);

  // Attempt to write file to disk
  fs.writeFile(path, data, 'utf8', (err) => {
    if (err) {
      throw err;
    }
  });
}

module.exports = { toTitleCase, writeJSONToFile };
