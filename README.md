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
    /*
      Here you can define a function that you can later call with `bot.generator()`.
      You can use `markov-strings` and (`compromise` (nlp))[https://github.com/nlp-compromise/compromise] which are passed in as argumetns.
      
      You should return a function here.
    */
  },
  botSetup: (bot) => {
    /*
      Here you define what your bot should actually do.
      
      For example, this one will repsond to every direct message with "Yes".
    */
    
    bot.on('directMessage', dm => {
      bot.sendDirectMessage(dm.sender.screen_name, 'Yes')
    })
  }
}
```

The arguments to the `generatorSetup` function  are:
- Markov: an instance of (`markov-strings`)[https://github.com/scambier/markov-strings]
- nlp: an instance of (`compromise`)[https://github.com/nlp-compromise/compromise]

They are entirely optional, though.

Now start the bot with

```sh
docker run --rm -v $(pwd):/data lnwdr/mintrahl my_bot.js
```

