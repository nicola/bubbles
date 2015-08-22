module.exports = Bubbles

var h = require('virtual-dom/h')
var inherits = require('util').inherits
var BaseElement = require('./base-element')
var url = require('url')
var path = require('path')

function Bubbles (target) {
  var self = this
  BaseElement.call(self, target)
}
inherits(Bubbles, BaseElement)

function getName (bubble) {
  var uri = bubble.subject.valueOf()
  var parsed = url.parse(uri)
  return path.basename(parsed.pathname)
}

Bubbles.prototype.render = function (bubbles, users) {
  var className = 'bubble'

  bubbles = bubbles
    .map(function (bubble) {
      var name = getName(bubble)

      return h('li.bubble', {className: className}, [
        h('.name', name)
      ], '#bubble_' + name)
    })

  return bubbles
}
