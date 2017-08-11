const Twit = require('twit')
const EventEmitter = require('events')

class Twitter extends EventEmitter {
  constructor (client, screenName, owner) {
    super()

    this.client = client
    this.screenName = screenName
    this.owner = owner

    this.userStream = client.stream('user')
    this.listenForDirectMessages()
  }

  log (...args) {
    console.log(`[${this.screenName}]`, ...args)
  }

  delay (fn) {
    setTimeout(fn, 2000 + 2000 * Math.random())
  }

  listenForDirectMessages () {
    this.userStream.on('direct_message', data => {
      const dm = data.direct_message
      if (dm.sender.screen_name !== this.screenName) {
        if (dm.sender.screen_name === this.owner) {
          const cmdMatch = dm.text.match(/^\/(\w+) ?(.*)$/)
          if (cmdMatch) {
            const name = cmdMatch[1]
            const content = cmdMatch[2]
            this.emit('command', {name, content})
          } else {
            this.emit('directMessage', dm)
          }
        } else {
          this.emit('directMessage', dm)
        }
      }
    })
  }

  sendDirectMessage (screenName, text) {
    this.delay(() => {
      this.client.post('direct_messages/new', {
        screen_name: screenName,
        text
      })
    })
  }

  sendOwnerMessage (text) {
    this.delay(() => {
      this.sendDirectMessage(this.owner, text)
    })
  }

  postTweet (text) {
    this.delay(() => {
      this.client.post('statuses/update', {
        status: text,
        enable_dm_commands: false
      })
    })
  }
}

let credentials
const getCredentials = client => {
  credentials = credentials || client
    .get('account/verify_credentials', {skip_status: true})
    .then(result => result.data)
    .catch(err => {
      credentials = null
      throw err
    })

  return credentials
}

const getScreenName = client => {
  return getCredentials(client).then(data => data.screen_name)
}

module.exports = (auth, owner) => {
  const client = new Twit(auth)
  return getScreenName(client).then(screenName => {
    return new Twitter(client, screenName, owner)
  })
}
