const { existsSync } = require('fs')
const commandLineArgs = require('command-line-args')
const makeBot = require('./twitter')
const Markov = require('markov-strings')
const nlp = require('compromise')

const optionDefinitions = [
  { name: 'configs', type: String, multiple: true, defaultOption: true }
]

const options = commandLineArgs(optionDefinitions)

if (options.configs.length === 0) {
  throw new Error('No bot definition file provided')
}

Promise.all(options.configs.map(configPath => {
  if (!existsSync(configPath)) {
    throw new Error(`File not found: ${configPath}`)
  }

  const { auth, owner, generatorSetup, botSetup } = require(configPath)

  return makeBot(auth, owner).then(bot => {
    bot.generator = generatorSetup(Markov, nlp)
    botSetup(bot)
    return bot
  })
})).then(bots => {
  console.log('Created', bots.length, bots.length === 1 ? 'bot' : 'bots')
}).catch(error => {
  console.log(error)
})
