module.exports = window.App = App

var EventEmitter = require('events').EventEmitter
var inherits = require('util').inherits

var createElement = require('virtual-dom/create-element')
var h = require('virtual-dom/h')
var diff = require('virtual-dom/diff')
var patch = require('virtual-dom/patch')

var Bubbles = require('../lib/elements/bubbles')
var Users = require('../lib/elements/users')
var Status = require('../lib/elements/status')
var webidLogin = require('../lib/webid-utils').loginTLS
var webidGet = require('webid-get')
var containersGet = require('../lib/container-utils').get
var getName = require('../lib/container-utils').getName
var page = require('page')

inherits(App, EventEmitter)
function App (el, currentWindow) {
  var self = this
  if (!(self instanceof App)) return new App(el)
  self.currentWindow = currentWindow

  // Mock data
  self.data = {
    webid: null,
    username: 'Anonymous',
    bubbles: [],
    activeBubble: null,
    storage: null
  }

  // Views
  self.views = {
    bubbles: new Bubbles(self),
    users: new Users(self),
    status: new Status(self)
  }

  // Router
  page.base(window.location.pathname)
  self.on('webid-retrieved', function () {

    page('/', function (ctx) {
      page(self.data.storage)
    })
    page('*', function (ctx) {
      self.data.activeBubble = null
      containersGet(ctx.path, function (err, containers) {
        if (err) return console.error(err)
        self.data.bubbles = containers.toArray()

        console.log(self.data.storage, ctx.path)
        if (self.data.storage !== ctx.path) {
          self.data.activeBubble = self.data.bubbles[0]
        }

        render()
      })
    })
    page.start({ hashbang: true })
  })

  // Initial DOM tree render
  var tree = self.render()
  var rootNode = createElement(tree)
  el.appendChild(rootNode)

  function render () {
    var newTree = self.render()
    var patches = diff(tree, newTree)
    rootNode = patch(rootNode, patches)
    tree = newTree
  }

  self.on('render', render)

  // Authenticate with webid
  webidLogin(function (err, webid) {
    if (err || !webid) self.emit('webid-error')
    if (err) {
      return console.error(err.message || err)
    }

    if (webid) {
      self.data.webid = webid
      return self.emit('webid-logged-in', webid)
    }

  })

  self.on('webid-logged-in', function () {

    // Get user profile
    webidGet(self.data.webid, function (err, profile) {
      if (err) return console.error(err)

      self.data.profile = profile

      // Setting username
      self.data.username = profile
        .match(self.data.webid, 'http://xmlns.com/foaf/0.1/name')
        .toArray()[0]
        .object.valueOf()

      render()

      // Setting storage
      var storage = profile
        .match(undefined, 'http://www.w3.org/ns/pim/space#storage')
        .toArray()[0]
        .object.valueOf()

      self.data.storage = storage
      self.emit('webid-retrieved')
    })
  })

}

App.prototype.render = function () {
  var self = this
  var views = self.views
  var data = self.data

  var top = null
  var backgroundImage = null
  var avatar = null

  if (data.activeBubble) {
    top = getName(data.activeBubble)
  } else if (!data.webid) {
    top = 'Logging in'
  } else if (data.username) {
    top = 'Hello ' + data.username.split(' ')[0]

    backgroundImage = data.profile
      .match(undefined, 'http://www.w3.org/ns/ui#backgroundImage')
      .toArray()[0]

    if (backgroundImage) {
      backgroundImage = backgroundImage.object.valueOf()
    }

    avatar = data.profile
      .match(undefined, 'http://xmlns.com/foaf/0.1/img')
      .toArray()[0]

    if (avatar) {
      avatar = avatar.object.valueOf()
    }
  }

  return h('div.layout', [
    h('.top', [
      views.status.render(top, backgroundImage, avatar)
    ]),
    h('.content', [
      h('.bubbles', [
        views.bubbles.render(data.bubbles, data.users)
      ])
    ])
  ])
}

