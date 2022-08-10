# tcb-opus

## What is it?

`tcb-opus` is a Discord bot you can use to get the latest manga chapters from **TCBScans** as soon as they come out!

To work properly, you first need to configure one of the channels in your Discord server to follow updates from the `#releases` text channel on the official TCB Discord server. This will cause any message posted by the original TCB bot in the `#releases` channel to be forwarded to your own channel on your Discord server.

Once a message is forwarded to your Discord channel, `tcb-opus` will analyse it and determine to what manga it corresponds. Once a valid manga has been recognized, `tcb-opus` will attempt to fetch the URL of the latest chapter for that manga from TCBScans. It will then send a message containing the chapter URL to whatever channel you like on your Discord server.

## Prequisites

Please make sure you have both [npm](https://www.npmjs.com/) and [Node.js](https://nodejs.org/) **v16.6+** installed otherwise this bot will not work.

## Installation

Simply run the following command to install to install the required dependencies on your system:

```sh
npm i
```

## Configuration

Before running the bot for the first time, you need to modify its configuration in [config.json](config.json). Here is what the default configuration file looks like:

```json
{
  "token": "YOUR_BOT_TOKEN",
  "prefix": "!",
  "opus": {
    "scanSite": "https://onepiecechapters.com/",
    "mangas": ["One Piece"],
    "discord": {
      "autoCreateThread": true,
      "notifyRole": "YOUR_ROLE_ID",
      "fromChannel": "YOUR_FROM_CHANNEL",
      "toChannel": "YOUR_TO_CHANNEL"
    }
  }
}
```

Here is the list of keys you can set:

- token: The token of your discord bot
- opus:
  - mangas: The names of the mangas you are interested in
  - discord:
    - notifyRole: The ID of the role to notify once the chapter comes out
    - fromChannel: The ID of the discord channel subscribed to the TCB server #releases channel
    - toChannel:The ID of the discord channel where you want the final message to appear

**NB:** Please do remember that your bot token must remain secret, do not share them with anyone unless you really trust them.

## Launching the bot

Once, you have installed the required packages and configured [config.json](config.json), you can launch the bot simply by typing:

```
npm start
```
