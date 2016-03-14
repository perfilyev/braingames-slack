var schedule = require("node-schedule");
var parse = require("./lib/parse");
var push = require("./lib/push");

var webhookUri = "https://hooks.slack.com/services/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";

schedule.scheduleJob({hour: 7, minute: 30}, function(){
  push(webhookUri);
});