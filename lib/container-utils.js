var xhr = require('xhr')
var LdpStore = require('rdf-store-ldp')
var rdf = require('rdf-ext')()
var store = new LdpStore(rdf);

exports.get = function (storage, callback) {
  store.graph(storage, function(graph, err) {
    var containers = graph.match(
      undefined,
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      'http://www.w3.org/ns/ldp#Container')

    callback(err, containers)
  })
}