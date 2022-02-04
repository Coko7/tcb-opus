// Import Node dependencies
const axios = require("axios");

/**
 * Fetch the latest manga chapter from TCBScans asynchronously.
 *
 * Scrap the homepage of TCBScans and search for data matching the given manga name.
 * The data fetched from TCBScans are the URL to the chapter page as well as the chapter number.
 * Finally, the data is returned in a JSON object wrapped into a Promise.
 * If the data could not be fetch, an error will be returned.
 *
 * @since       1.0.0
 * @access      public
 *
 * @param {string} manga    The manga name in Title Case.
 * @param {string} website  The url of TCBScans homepage.
 *
 * @return {Object} A Promise object containing a JSON object.
 */
async function fetchLatestChapter(manga, website) {
  const html = (await axios.get(website)).data.split("\n");
  const tagPrefix = '<a href="';

  for (const line of html) {
    if (line.includes(manga) && line.includes(tagPrefix)) {
      // Extract the chapter URL from the current line
      const urlStart = line.indexOf(tagPrefix);
      let url = line.slice(urlStart + tagPrefix.length);
      url = url.slice(0, url.indexOf('">'));

      const chapNumStart = url.lastIndexOf("-");
      if (chapNumStart === -1) {
        return {
          // Remove excess slashes from the URL
          url: (website + url).replace(/\/+/g, "/"),
        };
      }

      // Extract the chapter number from the current line
      let chapNum = url.slice(chapNumStart + 1);
      if (chapNum.charAt(chapNum.length) === "\\") {
        // Remove the slash at the end
        chapNum = chapNum.slice(0, -1);
      }

      return {
        chapter: chapNum,
        url: website + url,
      };
    }
  }

  // There is no entry for the given manga on TCB's homepage
  return { error: "NOT_FOUND" };
}

module.exports = { fetchLatestChapter };
