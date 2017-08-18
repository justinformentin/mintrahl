const Twit = require('twit')
const EventEmitter = require('events')

class Twitter extends EventEmitter {
  constructor (client, screenName, userId, owner) {
    super()

    this.client = client
    this.screenName = screenName
    this.owner = owner
    this.userId = userId

    this.userStream = client.stream('user')
    this.selfFollowStream = client.stream('statuses/filter', {
      follow: userId,
      replies: 'all'
    })

    this.listenForDirectMessages()
    this.listenForReplys()
    this.listenForRetweets()
    this.listenForFavs()
    this.listenForFollows()
  }

  log (...args) {
    console.log((new Date()).toISOString(), `[${this.screenName}]`, ...args)
  }

  delay (fn) {
    setTimeout(fn, 2000 + 2000 * Math.random())
  }

  listenForReplys () {
    this.selfFollowStream.on('tweet', data => {
      if (data.in_reply_to_user_id === this.userId) {
        this.log('REPLY from', data.user.screen_name)
        this.emit('reply', data)
      }
    })
  }

  listenForFavs () {
    this.userStream.on('favorite', data => {
      this.log('FAVORITE from', data.source.screen_name)
      this.emit('favorite', data)
    })
  }

  listenForFollows () {
    this.userStream.on('follow', data => {
      this.log('FOLLOW from', data.source.screen_name)
      this.emit('follow', data)
    })
  }

  listenForRetweets () {
    this.selfFollowStream.on('tweet', data => {
      if (data.retweeted_status) {
        this.log('RETWEET from', data.user.screen_name)
        this.emit('retweet', data)
      }
    })
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
            this.log('COMMAND', `[${name}]`, content)
            this.emit('command', {name, content})
          } else {
            this.log('DIRECT MESSAGE from', dm.sender.screen_name)
            this.emit('directMessage', dm)
          }
        } else {
          this.log('DIRECT MESSAGE from', dm.sender.screen_name)
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
      this.log('TWEETING', text)
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

module.exports = (auth, owner) => {
  const client = new Twit(auth)
  return getCredentials(client).then(credentials => {
    return new Twitter(client, credentials.screen_name, credentials.id, owner)
  })
}
