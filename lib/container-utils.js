var LdpStore = require('rdf-store-ldp')
var rdf = require('rdf-ext')()
var store = new LdpStore(rdf)
var url = require('url')
var path = require('path')

exports.get = function (storage, callback) {
  store.graph(storage, function (graph, err) {
    var containers = graph.match(
      undefined,
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      'http://www.w3.org/ns/ldp#Container')

    callback(err, containers)
  })
}

exports.getName = function (uri) {
  console.log("uri", uri)
  var parsed = url.parse(uri)
  return path.basename(parsed.pathname)
}

exports.getSubjects = function (graph) {
  var uris = {}
  graph.forEach(function (triple) {
    uris[triple.subject.valueOf()] = true
  })
  return Object.keys(uris)
}
