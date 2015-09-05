module.exports = Bubbles

var h = require('virtual-dom/h')
var inherits = require('util').inherits
var BaseElement = require('./base-element')
var getName = require('../container-utils').getName

function Bubbles (target) {
  var self = this
  BaseElement.call(self, target)
}
inherits(Bubbles, BaseElement)

Bubbles.prototype.render = function (bubbles, users) {
  var className = ''

  bubbles = bubbles
    .map(function (bubble) {
      var name = getName(bubble)

      return h('div.bubble', {className: className}, [
        h('.sphere'),
        h('a.name', {href: window.location.pathname + '#!' + bubble.subject.valueOf()}, name)
      ], '#bubble_' + name)
    })

  return bubbles
}
