# Mintrahl

A highly customizable Twitter bot for all kinds of nonsense.

## Usage

This is intended to be used as a docker image. [It is hosted on Docker Hub](https://hub.docker.com/r/lnwdr/mintrahl/).

Install with `docker pull lnwdr/mintrahl`

You can install it from NPM as well:

```sh
npm install -g mintrahl
``` 

Now you will need one or more bot definitons. Here's a minimal example:

`my_bot.js`:

```js
module.exports = {
  auth: {
    // put your twitter app's auth info here:
    consumer_key: '#####################',
    consumer_secret: '#####################',
    access_token: '########################',
    access_token_secret: '###################'
  },
  owner: 'lnwdr',
  botSetup: (bot) => {
    /*
      Here you define what your bot should actually do.
      You can use  instances of `markov-strings` and `compromise` (nlp) here which are suppliead
      in `bot.utils`.
      
      For example, this one will repsond to every direct message with "Yes".
    */
    
    bot.on('directMessage', dm => {
      bot.sendDirectMessage(dm.sender.screen_name, 'Yes')
    })
  }
}
```

### Events

The bot will emit the following events from the Twitter API:

- `reply`
- `directMessage`
- `favorite`
- `rewteet`
- `follow`

In addition it will emit a `command` event: a direct message from the "owner" username starting with a "/" followed by the command name, e.g. "/tweet whatever". the command event contains the `name` and the `content` (the rest of the DM) of the command. Use these commands to reomte control your bot.

### Utilities

The contents of to `bot.utils` are:
- Markov: an instance of [`markov-strings`](https://github.com/scambier/markov-strings)
- nlp: an instance of [`compromise`](https://github.com/nlp-compromise/compromise)

They are entirely optional to use, though.

### Logging

Use `bot.log()` for logging, it works just like `console.log`. It will write to stdout and prefix a timestamp and the bot's username.

### Launch

Now start the bot with

```sh
docker run --rm -v $(pwd):/data lnwdr/mintrahl my_bot.js
```

If you installed directly from NPM:

```sh
mintrahl my_bot.js
```
