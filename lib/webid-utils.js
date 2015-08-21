exports.loginTLS = loginTLS

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
