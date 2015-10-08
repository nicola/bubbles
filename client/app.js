module.exports = window.App = App

var LdpStore = require('rdf-store-ldp')
var rdf = require('rdf-ext')()
var EventEmitter = require('events').EventEmitter
var inherits = require('util').inherits

var createElement = require('virtual-dom/create-element')
var h = require('virtual-dom/h')
var diff = require('virtual-dom/diff')
var patch = require('virtual-dom/patch')

var Bubbles = require('../lib/elements/bubbles')
var Users = require('../lib/elements/users')
var Resources = require('../lib/elements/resources')
var Status = require('../lib/elements/status')
var webidLogin = require('../lib/webid-utils').loginTLS
var webidGet = require('webid-get')
var store = new LdpStore(rdf)
var getName = require('../lib/container-utils').getName
var getSubjects = require('../lib/container-utils').getSubjects
var page = require('page')
var SimpleRDF = require('simplerdf')

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
    resources: new Resources(self),
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
      store.graph(ctx.path, function (graph, err) {
        if (err) return console.error(err)

        var all = rdf.createGraph()
        var containers = rdf.createGraph()

        var contains = graph
          .match(
            undefined,
            'http://www.w3.org/ns/ldp#contains',
            undefined)
        contains
          .forEach(function (resource) {
            graph
              .match(resource.object.valueOf())
              .forEach(function (triple) {
                all.add(triple)
              })
          })

        graph
          .match(
            undefined,
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
            'http://www.w3.org/ns/ldp#Container')
          .forEach(function (resource) {
            graph
              .match(resource.subject.valueOf())
              .forEach(function (triple) {
                containers.add(triple)
              })
          })

        var resources = all.difference(containers)

        self.data.bubbles = containers
        self.data.resources = resources
        console.log("all", all.toString())
        console.log(containers.toString())
        console.log(resources.toString())

        if (self.data.storage !== ctx.path) {
          self.data.activeBubble = getSubjects(self.data.bubbles)[0]
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
    webidGet(self.data.webid, function (err, graph) {
      if (err) return console.error(err)

      self.data.profile = new SimpleRDF(self.data.webid, graph)
      self.data.username = self.data.profile['http://xmlns.com/foaf/0.1/name']
      self.data.storage = self.data.profile['http://www.w3.org/ns/pim/space#storage']

      self.emit('webid-retrieved')
      render()
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

    backgroundImage = data.profile['http://www.w3.org/ns/ui#backgroundImage']
    avatar = data.profile['http://xmlns.com/foaf/0.1/img']
  }

  return h('div.layout', [
    h('.top', [
      views.status.render(top, backgroundImage, avatar)
    ]),
    h('.content', [
      h('.bubbles', [
        views.bubbles.render(data.bubbles || [], data.users)
      ]),
      h('.resources', [
        views.resources.render(data.resources || [])
      ])
    ])
  ])
}

