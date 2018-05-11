
const request = require('request')
const cloudant = require('@cloudant/cloudant')

var soSearch = function(tag) {
  var req = {
    method: 'get',
    uri: 'https://api.stackexchange.com/2.2/search',
    qs: {
      // key: key,
      pagesize:10,
      order: 'desc',
      sort: 'creation',
      tagged: tag,
      site: 'stackoverflow',
      filter: 'withbody'
    },
    json: true,
    gzip: true
  }
  return new Promise(function(resolve, reject) {
    request(req, function(err, res, body) {
      if (err) {
        return reject(err)
      }
      resolve(body)
    })
  })
}

var main = function(opts) {
  var db = cloudant({account: opts.ACCOUNT, password: opts.PASSWORD, plugins: ['promises']}).db.use(opts.DBNAME)
  return soSearch(opts.TAG).then((body) => {
    for(var i in body.items) {
      var item = body.items[i]
      item['_id'] = '' + item['question_id']
    }
    return db.bulk({docs: body.items})
  }).then((data) => {
    return { statusCode: 200, body: JSON.stringify({})}
  })
}

exports.main = main;