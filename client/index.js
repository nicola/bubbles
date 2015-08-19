module.exports = Web

var inherits = require('util').inherits
var App = require('./app.js')

inherits(Web, App)

function Web () {
  if (!(this instanceof Web)) return new Web()
  App.call(this, document.body)
}

Web()
