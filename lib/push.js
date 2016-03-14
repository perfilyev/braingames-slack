var fs = require("fs");
var Slack = require('slack-node');

function braingamesText(data) {
    return '<http://www.braingames.ru/?path=comments&puzzle=' + data.id + '|' + data.name + '>\r\n' + data.puzzle 
}

module.exports = function(uri) {
  var data = JSON.parse(fs.readFileSync('data/braingames-puzzles.js').toString());
  var puzzle = data.puzzles.pop();
  if (puzzle) {
    var slack = new Slack();
    slack.setWebhook(uri);

    slack.webhook({
      channel: "#braingames",
      username: "bot",
      text: braingamesText(puzzle)
    }, function(err, response) {
      console.log(response);
    });
    
    data.done.push(puzzle);
    fs.writeFileSync('data/braingames-puzzles.js', JSON.stringify(data, true, ' '));
  }
  
  return puzzle;
}