var fs = require("fs");
var http = require("http");
var url = require("url");
var iconv = require("iconv-lite");
var dateFormat = require('dateformat');
var entities = require("html-entities").AllHtmlEntities;

var options = url.parse('http://www.braingames.ru/?path=category&catname=algebra&displayOpts=tree');
var puzzleRegExp = /background:#DDFFDD.* href='.*puzzle=([0-9]*)' title='.*[\r|\n]([^>]*)'> \([\d]*\) <b>(.*)<\/b>/g
var ahrefRegExp = /<a href="(.*)">(.*)<\/a>/g;

var puzzleMatch, ahrefMatch;

options.headers = {'User-Agent': 'request'};

function getPuzzlesFromHTML(str) {
  var puzzles = [];
  while ((puzzleMatch = puzzleRegExp.exec(str)) !== null) {
    var puzzle = entities.decode(puzzleMatch[2].trim().replace(/&amp;/g, '&')).replace(/<br[\/|\s]*>/g, '/r/n'); 
    
    while ((ahrefMatch = ahrefRegExp.exec(puzzle)) !== null) {
      var uriOrUrl = ahrefMatch[1];
      var url = uriOrUrl.startsWith('/') ? 'http://www.braingames.ru' + uriOrUrl : uriOrUrl;
      puzzle = puzzle.replace(ahrefMatch[0], '<' + url + '|' + ahrefMatch[2] + '>')
    }
  
  if (puzzle.match(/<[^p|u|http|\/]/)) continue;
  
  puzzle = puzzle.replace(/(<([^>|http]+)>)/ig, "");
  puzzles.push({id: puzzleMatch[1], name: puzzleMatch[3], puzzle: puzzle});
  }
  
  return puzzles;
}

module.exports = function() {
  http.get(options, (res) => {
    var buffers = [];
    res.on('data', (data)=>{
      buffers.push(data);
    }).on('end', ()=>{
      var htmlPage=iconv.decode(Buffer.concat(buffers), 'win1251');
      var puzzles = getPuzzlesFromHTML(htmlPage);
      fs.writeFileSync('data/braingames-puzzles-' + dateFormat(new Date(), 'dd-mm-yyyy')  + '.js', JSON.stringify({puzzles: puzzles, done: []}, true, ' '));
    });
  });
}