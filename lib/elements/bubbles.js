module.exports = Bubbles

var h = require('virtual-dom/h')
var inherits = require('util').inherits
var BaseElement = require('./base-element')

function Bubbles (target) {
  var self = this
  BaseElement.call(self, target)
}
inherits(Bubbles, BaseElement)

Bubbles.prototype.render = function (bubbles, users) {
  bubbles = bubbles.map(function (bubble) {
    var className = 'bubble'
    return h('li', {className: className}, [

    ], '#' + bubble.name)
  })
}
