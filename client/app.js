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
var webidGetProfile = require('../lib/webid-utils').getProfile

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
    activeBubble: null
  }

  // Views
  self.views = {
    bubbles: new Bubbles(self),
    users: new Users(self),
    status: new Status(self)
  }

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
    if (err || !webid) self.emit('webidError')
    if (err) {
      return console.error(err.message || err)
    }

    if (webid) {
      self.data.webid = webid

      // Get user profile
      webidGetProfile(self.data.webid, function (err, profile) {
        if (err) return console.error(err)
        self.data.username = profile['http://xmlns.com/foaf/0.1/name']
        render()
      })
    }

    render()
  })

}

App.prototype.render = function () {
  var self = this
  var views = self.views
  var data = self.data

  return h('div.layout', [
    h('.top', [
      views.status.render(data.username)
    ]),
    h('.content', [
      views.bubbles.render(data.bubbles, data.users)
    ])
  ])
}

