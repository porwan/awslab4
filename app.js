var helpers = require("./helpers");
var ACTIONS_FOLDER = "./actions/";
var ACTIONS_CONFIG_FILE = "actions.json";
var PORT = 8080;
var SQSCommand = require("./sqscommand");
var SQSConsole = require("./sqsconsole");


var actionsCofig = helpers.readJSONFile(ACTIONS_CONFIG_FILE);

actionsCofig.forEach(function(elem){
	if(elem.action && elem.path){
		if(!elem.action.template){
			elem.action = require(ACTIONS_FOLDER + elem.action).action;
		}
	}else {
		console.log("unknown configuration: " + JSON.stringify(elem));
	}
});

var urls = function(){
	var options = {
		host: 'www.google.com',
		port: 80,
		path: '/index.html'
	};

	http.get(options, function(res) {
		console.log("Got response: " + res.statusCode);

		res.on("data", function(chunk) {
			console.log("BODY: " + chunk);
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};

var initConsole = function(AWS) {
	var appConfig = helpers.readJSONFile(APP_CONFIG_FILE);
	var queue = new Queue(new AWS.SQS(), appConfig.QueueUrl);
	var sqsCommand = new SQSCommand(queue);
	new SQSConsole(sqsCommand);
}

var service = require("webs-weeia").http(actionsCofig);

service(PORT);







