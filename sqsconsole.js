var readline = require('readline');

module.exports = function(sqsCommands){
	var _this = this;
	_this.sqsCommands = sqsCommands;
	_this.rl = readline.createInterface(process.stdin, process.stdout);
	_this.rl.setPrompt('sqs> ');
	_this.rl.prompt();
	_this.rl.on('line', function(line) {
		
		line = line.trim();
		if(line.length > 0){
			var splitted_line = line.split(" ", 1);
			splitted_line[1] = line.substr(splitted_line[0].length+1, line.length).trim();
			console.log(splitted_line.join(", "));
			_this.sqsCommands.execCommand(splitted_line[0], splitted_line[1], function(err, data){
				if(err) { 
					console.log("'" + splitted_line[0] + "' command error: " + err); 
				}
				else {
					console.log("'" + splitted_line[0] + "' command executed: " + JSON.stringify(data));
				}
				_this.rl.prompt();
			});
		}
		_this.rl.prompt();
	}).on('close',function(){
    	process.exit(0);
	});
}