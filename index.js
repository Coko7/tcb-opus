// Import Node dependencies
const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Import local dependencies
const utils = require("./utils");
const scraper = require("./scraper");

// Load config and data files
const config = require("./config.json");
const data = require("./data.json");

// Load the manga interests and fix their case to be title case
const mangas = config.opus.mangas.map((m) => utils.toTitleCase(m));

client.once("ready", () => {
  console.log("tcb-opus module is ready!");
});

client.on("messageCreate", async (message) => {
  // If the message is sent by this bot, ignore it
  if (message.author.id === client.user.id) return;

  // If the message was not sent in input channel, ignore it
  if (message.channel.id !== config.opus.discord.fromChannel) return;

  // Check whether the message contains one of the desired mangas
  const manga = mangas.find((m) =>
    message.content.toLowerCase().includes(m.toLowerCase())
  );

  if (manga) {
    // Fetch the latest chapter from TCBScans website
    const res = await scraper.fetchLatestChapter(manga, config.opus.scanSite);

    if (res.error) {
      console.error(`Error occured while fetching ${manga}: ${res.error}`);
      return;
    } else if (res.chapter) {
      // Send a message with the chapter link in the output channel
      client.channels.cache
        .get(config.opus.discord.toChannel)
        .send(
          `<@&${config.opus.discord.notifyRole}> ${manga} chapter **${res.chapter}** is out!\n${res.url}`
        );

      console.log(`Successfully fetched ${manga} chapter ${res.chapter}`);

      // Update data file with latest chapter number
      if (!data.mangas) data.mangas = [];
      const stored = data.mangas.find((m) => m.name === manga);

      if (stored) {
        // If the stored chapter is not the latest
        if (stored.chapter < res.chapter) {
          const missed = res.chapter - stored.chapter - 1;
          if (missed > 0) {
            console.log(
              `I missed ${missed} ${manga} chapter${missed > 1 ? "s" : ""}!`
            );
          }

          stored.chapter = res.chapter;
          stored.url = res.url;
          utils.writeJSONToFile(data, "./data.json");
        }
      } else {
        data.mangas.push({
          name: manga,
          chapter: res.chapter,
          url: res.url,
        });
        utils.writeJSONToFile(data, "./data.json");
      }
    }
  }
});

// Login to Discord with the app token
client.login(config.token);

/**
 * Fetch important elements from the TCB message and create a new message.
 *
 * @since       pre-1.0.0
 * @access      private
 *
 * @param {string} msg The discord message from TCB
 *
 * @return {string} A formatted message containing the chapter link.
 */
function formatTCBMessage(msg) {
  const urlStart = msg.indexOf("http");

  if (urlStart === -1)
    throw new Error("No URL contained in the given TCB message");

  const url = msg.slice(urlStart);
  const chapNum = url.slice(url.lastIndexOf("-") + 1);

  return `<@&${config.opus.discord.notifyRole}> One Piece chapter **${chapNum}** is out!\n${url}`;
}
