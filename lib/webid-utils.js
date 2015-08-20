exports.loginTLS = loginTLS
exports.get = get

var xhr = require('xhr')

function loginTLS (callback) {
  xhr({
    uri: 'https://rww.io',
    withCredentials: true,
    method: 'HEAD'
  }, function (err, res) {
    callback(err, res.headers.user)
  })
}

var async = require('async')
var rdf = require('rdf-ext')()

function toString (sym) {
  return sym.object.toString()
}

function get (webid, graph, callback) {
  if (typeof graph === 'function') {
    callback = graph
    graph = null
  }
  graph = graph || rdf.createGraph()
  profile(webid, graph, callback)
}

function profile (webid, finalGraph, callback) {
  var store = new rdf.LdpStore()
  var iri = webid.split('#')[0]

  store.graph(iri, function (graph, err) {
    if (err) return callback(err)

    finalGraph.addAll(graph)

    var sameAs = graph
      .match(webid, 'http://www.w3.org/2002/07/owl#sameAs', null)
      .toArray()
      .map(toString)

    var seeAlso = graph
      .match(webid, 'http://www.w3.org/2002/07/owl#seeAlso', null)
      .toArray()
      .map(toString)

    var webids = sameAs.concat(seeAlso)

    var prefs = graph
      .match(webid, 'http://www.w3.org/ns/pim/space#preferencesFile', null)
      .toArray()
      .map(toString)

    var getWebids = function (cb) {
      async.each(webids, function (webid, next) {
        profile(webid, finalGraph, next)
      }, cb)
    }

    var getPrefs = function (cb) {
      async.each(prefs, function (pref, next) {
        store.graph(pref, function (graph, err) {
          finalGraph.addAll(graph)
          next(err, graph)
        })
      }, cb)
    }

    async.parallel([getPrefs, getWebids], function (err) {
      callback(err, finalGraph)
    })
  })
}
