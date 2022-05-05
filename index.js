// Import Node dependencies
const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

let waitForYAGPDBQueue = [];

// Import local dependencies
const utils = require("./utils");
const scraper = require("./scraper");

const casiogrub = require("./casiogrub");

// Load config and data files
const config = require("./config.json");
const data = require("./data.json");

// Load the manga interests and fix their case to be title case
const mangas = config.opus.mangas.map((m) => utils.toTitleCase(m));

client.once("ready", () => {
  console.log("tcb-opus module is ready!");
});

client.on("messageCreate", (message) => {
  // If the message is sent by this bot, ignore it
  if (message.author.id === client.user.id) return;

  if (message.channel.id === config.opus.discord.fromChannel) {
    processTCBMessage(message);
  }

  if (message.author.id === "204255221017214977") {
    console.log(waitForYAGPDBQueue);
    let req = waitForYAGPDBQueue.pop();

    if (req) {
      if (message.content.indexOf("is not a whole number") >= 0) {
        if (!req.fail) {
          setTimeout(() => {
            message.channel.send(
              `${message.author} Just do the maths bro :smiley:, thats __**${req.result}**__`
            );
          }, 1000);
        }
      }
    }
  }

  if (
    message.content.startsWith("-takerep") ||
    message.content.startsWith("-giverep")
  ) {
    const equation = message.content.substring(
      message.content.indexOf(">") + 1
    );
    console.log(equation);
    try {
      const res = casiogrub.evalInput(equation);
      console.log(res);
      waitForYAGPDBQueue.push({
        user: message.author.id,
        result: res,
        fail: false,
      });
    } catch (err) {
      waitForYAGPDBQueue.push({ user: message.author.id, fail: true });
      console.log(err);
    }
  }
});

function processTCBMessage(message) {
  const mangaMentioned = mangas.find((m) =>
    message.content.toLowerCase().includes(m.toLowerCase())
  );

  if (mangaMentioned) {
    // Fetch the latest chapter from TCBScans website
    scraper
      .fetchLatestChapter(mangaMentioned, config.opus.scanSite)
      .then((res) => {
        if (res.error) {
          console.error(
            `Error occured while fetching ${mangaMentioned}: ${res.error}`
          );
        } else {
          if (res.chapter) {
            // Send a message with the chapter link in the output channel
            client.channels.cache
              .get(config.opus.discord.toChannel)
              .send(
                `<@&${config.opus.discord.notifyRole}> ${mangaMentioned} chapter **${res.chapter}** is out!\n${res.url}`
              );

            console.log(
              `Successfully fetched ${mangaMentioned} chapter ${res.chapter}`
            );

            // Update data file with latest chapter number
            if (!data.mangas) data.mangas = [];
            const stored = data.mangas.find((m) => m.name === mangaMentioned);

            if (stored) {
              // If the stored chapter is not the latest
              if (stored.chapter < res.chapter) {
                const missed = res.chapter - stored.chapter - 1;
                if (missed > 0) {
                  console.log(
                    `I missed ${missed} ${mangaMentioned} chapter${
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
                name: mangaMentioned,
                chapter: res.chapter,
                url: res.url,
              });
              utils.writeJSONToFile(data, "./data.json");
            }
          }
        }
      });
  }
}

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
