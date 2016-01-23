var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var AWS = require("aws-sdk");
var qs = require('querystring');
AWS.config.loadFromPath('./config.json');
var formidable = require("formidable");
var util = require('util');

var task = function (request, callback) {
    var form = new formidable.IncomingForm();
    var promise = new Promise(function (resolve, reject) {
        form.parse(request, function (err, fields, files) {
            //Store the data from the fields in your data store.
            //The data store could be a file or database or any other store based
            //on your application.
            var nameList = [];
            console.log(fields);
            for (var i = 0; i < parseInt(fields.counter); i++) {
                var name = fields['check' + i];
                if (name) {
                    nameList.push(name);
                }
            }
            resolve(nameList);
        });
    });
    promise.then(function (nameList) {
        var queue = new AWS.SQS({params: {QueueUrl: 'https://sqs.us-west-2.amazonaws.com/983680736795/prokopczykSQS'}});
        nameList.forEach(function (item) {
            queue.sendMessage({MessageBody: item}, function (err, data) {
                if (!err) console.log('Message sent.');
            });
        })
        callback(null, nameList);
    });

}

exports.action = task
