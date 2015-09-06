module.exports = Status

var h = require('virtual-dom/h')
var inherits = require('util').inherits
var BaseElement = require('./base-element')

function Status (target) {
  BaseElement.call(this, target)
}
inherits(Status, BaseElement)

Status.prototype.render = function (name, background, avatar) {
  var optsStatus = { style: {} }
  if (background) optsStatus.style.backgroundImage = 'url(' + background + ')'

  var optsAvatar = {
    style: {
      display: avatar ? 'inline' : 'none'
    }
  }
  if (avatar) optsAvatar.src = avatar

  return h('.status', optsStatus, [
    h('.username', [
      name,
      h('img.avatar', optsAvatar)
    ])
  ])
}
