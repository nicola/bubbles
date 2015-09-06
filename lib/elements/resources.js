module.exports = Resources

var h = require('virtual-dom/h')
var inherits = require('util').inherits
var BaseElement = require('./base-element')
var getName = require('../container-utils').getName

function Resources (target) {
  var self = this
  BaseElement.call(self, target)
}
inherits(Resources, BaseElement)

Resources.prototype.render = function (resources, users) {
  var className = ''

  resources = resources
    .map(function (resource) {
      var name = getName(resource)

      return h('div.resource', {className: className}, [
        h('.details', [
          h('.name', name)
        ])
      ], '#resource_' + name)
    })

  return resources
}
