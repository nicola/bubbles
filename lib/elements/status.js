module.exports = Status

var h = require('virtual-dom/h')
var inherits = require('util').inherits
var BaseElement = require('./base-element')

function Status (target) {
  BaseElement.call(this, target)
}
inherits(Status, BaseElement)

Status.prototype.render = function (name, background, avatar) {
  var opts = { style: {} }
  if (background) opts.style.backgroundImage = 'url(' + background + ')'
  console.log(opts)
  return h('.status', opts, [
    h('.username', [
      name,
      h('img.avatar', {
        src: avatar,
        style: {
          display: avatar ? 'inline' : 'none'
        }
      })
    ])
  ])
}
