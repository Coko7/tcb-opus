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
const opus = require("./opus-config.json");
const data = require("./data.json");

// Load the manga interests and fix their case to be title case
const mangas = opus.mangas.map((m) => {
  m.name = utils.toTitleCase(m.name);
  return m;
});

client.once("ready", () => {
  console.log("tcb-opus module is ready!");
});

client.on("messageCreate", async (message) => {
  // If the message is sent by this bot, ignore it
  if (message.author.id === client.user.id) return;

  // If the message was not sent in input channel, ignore it
  if (!isListenChannel(message.channel.id)) return;

  // Check whether the message contains one of the desired mangas
  // Use regular expression instead of name if 'regexName' is defined
  const manga = mangas.find((m) => {
    if (m.regex) {
      const re = new RegExp(m.regex, "i");
      return message.content.match(re);
    }
    return message.content.toLowerCase().includes(m.name.toLowerCase());
  });

  if (manga && manga.active) {
    // Fetch the latest chapter from TCBScans website
    const res = await scraper.fetchLatestChapter(manga.name, opus.scanSite);

    if (res.error) {
      console.error(`Error occured while fetching ${manga.name}: ${res.error}`);
      return;
    } else if (res.chapter) {
      // Get the Discord output channel for the current manga
      const channel = client.channels.cache.get(manga.toChannel);
      const notifyPrefix = manga.notifyRole ? `<@&${manga.notifyRole}> ` : "";

      // Send a message with the chapter link in the output channel
      await channel.send(
        `${notifyPrefix}${manga.name} chapter **${res.chapter}** is out!\n${res.url}`
      );

      console.log(`Successfully fetched ${manga.name} chapter ${res.chapter}`);

      // Automatically create a thread to talk about the chapter if configured
      if (manga.autoCreateThread) {
        const threadName = `chap-${res.chapter}-talk`;

        // Create thread if not exist
        let thread = channel.threads.cache.find((t) => t.name === threadName);

        if (!thread) {
          thread = await channel.threads.create({
            name: threadName,
            autoArchiveDuration: 60 * 24 * 7,
            reason: "Lets talk about this chapter",
          });

          console.log(`Created thread: ${thread.name}`);
        }

        await channel.send(
          `Please go to the designated thread <#${thread.id}> to talk about the chapter without spoiling anyone :slight_smile:`
        );
      }

      // Update data file with latest chapter number
      if (!data.mangas) data.mangas = [];
      const stored = data.mangas.find((m) => m.name === manga.name);

      if (stored) {
        // If the stored chapter is not the latest
        if (stored.chapter < res.chapter) {
          const missed = res.chapter - stored.chapter - 1;
          if (missed > 0) {
            console.log(
              `I missed ${missed} ${manga.name} chapter${
                missed > 1 ? "s" : ""
              }!`
            );
          }

          stored.chapter = res.chapter;
          stored.url = res.url;
          utils.writeJSONToFile(data, "./data.json");
        }
      } else {
        data.mangas.push({
          name: manga.name,
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
 * @param {string} manga The manga object
 *
 * @return {string} A formatted message containing the chapter link.
 */
function formatTCBMessage(msg, manga) {
  const urlStart = msg.indexOf("http");

  if (urlStart === -1)
    throw new Error("No URL contained in the given TCB message");

  const url = msg.slice(urlStart);
  const chapNum = url.slice(url.lastIndexOf("-") + 1);

  return `<@&${manga.notifyRole}> ${manga.name} chapter **${chapNum}** is out!\n${url}`;
}

/**
 * Fetch important elements from the TCB message and create a new message.
 *
 * @since       1.2.0
 * @access      private
 *
 * @param {string} channelId The ID of the discord channel where TCB updates are sent
 *
 * @return {bool} True if the channel is a TCB update channel, false otherwise.
 */
function isListenChannel(channelId) {
  if (mangas.find((m) => m.fromChannel === channelId)) return true;

  return false;
}
