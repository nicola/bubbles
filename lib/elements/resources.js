module.exports = Resources

var h = require('virtual-dom/h')
var inherits = require('util').inherits
var BaseElement = require('./base-element')
var getName = require('../container-utils').getName
var getSubjects = require('../container-utils').getSubjects
var string = require('string')

function Resources (target) {
  var self = this
  BaseElement.call(self, target)
}
inherits(Resources, BaseElement)

Resources.prototype.render = function (resources, users) {
  var className = ''
  console.log("resources", resources)
  resources = getSubjects(resources)
    .map(function (resource) {
      var name = getName(resource)

      var viewer
      if (string(name).endsWith('png')) {
        viewer = h('img.viewer', {src: resource})
      } else if (string(name).endsWith('jpg')) {
        viewer = h('img.viewer', {src: resource})
      }

      return h('div.resource', {className: className}, [
        h('.details', [
          h('a.name', {href: resource}, name),
          viewer
        ])
      ], '#resource_' + name)
    })

  return resources
}
