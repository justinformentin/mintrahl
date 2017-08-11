# Mintrahl

A highly customizable Twitter bot for all kinds of nonsense.

## Usage

This is intended to be used as a docker image. (It is hosted on Docker Hub)[https://hub.docker.com/r/lnwdr/mintrahl/].

Install with `docker pull lnwdr/mintrahl`

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
  generatorSetup: (Markov, nlp) => {
    // 
  },
  botSetup: (bot) => {
    //
  }
}
```

Now start the bot with

```sh
docker run --rm -v $(pwd):/data lnwdr/mintrahl my_bot.js
```

