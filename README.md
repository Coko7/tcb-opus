# tcb-opus

A discord bot to get the latest manga chapters as soon as they comes out.

## Installation

Simply run the following command to install to install the required packages:

```sh
npm i
```

## Configuration

Before running the bot for the first, you need to modify its configuration in [config.json](config.json). Here is what the default configuration file looks like:

```json
{
  "token": "YOUR_BOT_TOKEN",
  "prefix": "!",
  "opus": {
    "scanSite": "https://onepiecechapters.com/",
    "mangas": ["One Piece"],
    "discord": {
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
