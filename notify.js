const request = require('request')
const cloudant = require('@cloudant/cloudant')

var notify = function(hookURL, message) {
  return new Promise(function(resolve, reject) {
    var options = {
      "text": message,
      "icon_emoji": ":postit:"
    }
    request({
      url: hookURL,
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(options)
    }, function (err, response, body) {
      if(err) {
        console.log(err)
        reject ({payload: "Failed"})
      } else {
        console.log("Status: " + response.statusCode)
        console.log("Response Body: " + body)
        resolve( {payload: "Notified"} )
      }
    });
  })
}

var main = function(opts) {
  var db = cloudant({account: opts.ACCOUNT, password: opts.PASSWORD, plugins: ['promises']}).db.use(opts.DBNAME)
  if (!opts.id) {
    throw(new Error('missing id'))
  }
  return db.get(opts.id).then((data) => {
    console.log(data)
    // first revisions only
    if (data._rev.match(/^1\-/)) {
      var message = "New question: <" + data.link + "|" + data.title + "> (tagged: " + data.tags + ")"
      console.log(message)
      return notify(opts.HOOK, message)
    } else {
      return {}
    }


  })
}

exports.main = main