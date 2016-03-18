var fs = require('fs');
var express = require('express');
var parse = require("./lib/parse");

parse();

var app = express();

app.post('/api/message',(req, res) => {
  var data = JSON.parse(fs.readFileSync('data/braingames-puzzles.js').toString());
  var puzzle = data.puzzles.pop();
  if (puzzle) {
    data.done.push(puzzle);
    fs.writeFileSync('data/braingames-puzzles.js', JSON.stringify(data, true, ' '));
    res.send({"text": puzzle.name + '\r\n' + puzzle.puzzle});
  } else res.send({});
});

var server = app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log('Version: ' + process.version);
  console.log("Slack server app listening at ", addr.address + ":" + addr.port + "; : SERVICE HOST: " + process.env.SERVICE_HOST);
});