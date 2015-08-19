exports.loginTLS = loginTLS
exports.getProfile = getProfile

var xhr = require('xhr')
var rdf = require('rdf-ext')()

function loginTLS (callback) {
  xhr({
    uri: 'https://rww.io',
    withCredentials: true,
    method: 'HEAD'
  }, function (err, res) {
    callback(err, res.headers.user)
  })
}

function getProfile (webid, callback) {
  xhr({
    uri: webid,
    method: 'GET',
    headers: {
      'Content-Type': 'application/ld+json'
    }
  },
  function (err, res, body) {
    if (err) callback(err)

    var store = new rdf.LdpStore()
    var IRI = webid.split('#')[0]

    store.graph(IRI, function (graph, err) {
      if (err) return callback(err)

      var triples = graph.match(webid, null, null)
      var obj = rdf.serializeJsonLd(triples)
      callback(err, obj[0])
    })
  })
}
