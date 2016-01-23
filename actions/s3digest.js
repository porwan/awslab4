var AWS = require("aws-sdk");

AWS.config.loadFromPath('./config.json');

var task =  function(request, callback){

    var bucket = request.query.bucket;
    var etag = request.query.etag;
    var key = request.query.key;


    callback(null, {params:{key:key, bucket:bucket}});
}

exports.action = task