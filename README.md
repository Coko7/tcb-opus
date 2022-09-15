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

### Bot token and prefix
First, you need to create a Discord application and bot on Discord [Developer Portal](https://discord.com/developers/applications).
Then, create a file named `config.json` with the following content:
```json
{
  "token": "YOUR_BOT_TOKEN",
  "prefix": "!",
}
```
Replace `YOUR_BOT_TOKEN` with the token of your bot.

### OPUS setup

Now that `config.json` has been created, you need to configure the bot to listen for specific manga releases and notify users.
To do that, open the file [opus-config.json](./opus-config.json). It should have the following content by default:

```json
{
  "scanSite": "https://onepiecechapters.com/",
  "mangas": [
    {
      "name": "One Piece",
      "active": true,
      "notifyRole": "DISCORD_ROLE_ID",
      "fromChannel": "TCB_LISTEN_CHANNEL_ID",
      "toChannel": "OPUS_NOTIFY_CHANNEL_ID",
      "autoCreateThread": true
    },
    {
      "name": "Black Clover",
      "active": true,
      "notifyRole": "DISCORD_ROLE_ID",
      "fromChannel": "TCB_LISTEN_CHANNEL_ID",
      "toChannel": "OPUS_NOTIFY_CHANNEL_ID",
      "autoCreateThread": true
    }
  ]
}
```

You do not need to change `scanSite` as only TCB can be used right now. 
The default configuration registers listen events for two mangas: **One Piece** and **Black Clover**.
You can register as many mangas as you want as long as the scans exist on the TCB website.

Manga attributes:
- The `name` attribute of a manga is the most important as it is used to identify a manga on TCB. Make sure to get it right.
- The `active` attribute can be used to disable notification for a specific manga without removing its configuration.
- The `notifyRole` attribute will be used in the notification message to notify a specific Discord role. The value must be a valid Discord role ID on your Discord server. *This attribute is optional. If omitted, the notification message will not ping any role.*
- The `fromChannel` attribute is the Discord channel ID in which you receive TCB releases notifications.
- The `toChannel` attribute is the Discord channel ID of the channel where you want OPUS notifications to be sent.
- The `autoCreateThread` attribute is used to automatically create a thread to talk about a new chapter release. The thread will be attached to the `toChannel` channel. *This attribute is optional. If omitted, no thread will be created.*

## Launching the bot

Once, you have installed the required packages and configured [config.json](config.json), you can launch the bot simply by typing:

```
npm start
```
