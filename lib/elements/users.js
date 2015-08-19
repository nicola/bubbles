module.exports = Users

var h = require('virtual-dom/h')
var inherits = require('util').inherits
var BaseElement = require('./base-element')

function Users (target) {
  var self = this
  BaseElement.call(self, target)
}
inherits(Users, BaseElement)

Users.prototype.render = function (users) {
  users = users.map(function (user) {
    var className = 'users'
    return h('li', {className: className}, [

    ], '#' + user.name)
  })
}
