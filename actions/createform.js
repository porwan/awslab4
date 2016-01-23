var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "index.ejs";
var AWS = require("aws-sdk");
var Promise = require("promise");

AWS.config.loadFromPath('./config.json');

var task = function (request, callback) {
    //1. load configuration
    var awsConfig = helpers.readJSONFile(AWS_CONFIG_FILE);
    var policyData = helpers.readJSONFile(POLICY_FILE);

    //2. prepare policy
    var policy = new Policy(policyData);

    //3. generate form fields for S3 POST
    var s3Form = new S3Form(policy);
    //4. get bucket name
    var bucket = policy.getConditionValueByKey("bucket");

    var fields = s3Form.generateS3FormFields();
    fields = s3Form.addS3CredientalsFields(fields, awsConfig);

    //create images list
    var s3 = new AWS.S3();
    var params = {
        Bucket: 'lab4-weeia',
        Prefix: 'andrzej.prokopczyk/'
    };

    var promise = new Promise(function (resolve, reject) {
        var urlList = [];
        s3.listObjects(params, function (err, data) {
            if (err) {
                return err;
            }
            data.Contents.forEach(function (elem) {
                if (elem.Key !== 'andrzej.prokopczyk/') {
                    var params = {Bucket: 'lab4-weeia', Key: elem.Key};
                    s3.getSignedUrl('getObject', params, function (err, url) {
                        var elemet = {
                            name: elem.Key,
                            url: url
                        }
                        urlList.push(elemet);
                    });
                }
            });
            resolve(urlList);
        })
    });
    promise.then(function (urlList) {
        callback(null, {template: INDEX_TEMPLATE, params: {fields: fields, bucket: bucket, urlList: urlList}});
    });
}

exports.action = task;
