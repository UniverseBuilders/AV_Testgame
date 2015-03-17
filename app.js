var express = require('express');
var app = express();
var serveStatic = require('serve-static');
var fs = require('fs');
var bodyParser = require('body-parser')

// build the window.gameData setting javascript file. TODO: this is the worst thing I have ever done
console.log("hacking together the game data...");
var gameData = {};
gameData.save = require("./gameData/currentGame.json");
gameData.districtData = require("./gameData/districtTypes.json");
gameData.regionData = require("./gameData/regions.json");
gameData.upgradeData = require("./gameData/upgrades.json");
fileData = "window.gameData="+JSON.stringify(gameData);
console.log(fileData);
fs.writeFileSync("./gameData/GAME_DATA.js", fileData);

console.log("prepping the server...");
// set up for post req.body parser
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// serve static pages
app.get('/*', serveStatic('./', {'index': ['index.html']}));

// accept POST request for updating the game
app.post('/uploadCurrentGame', function (req, res) {
    console.log(req.body);

    //TODO: save the file (once req.body is working correctly...
    fs.writeFile('gameData/currentGame.json', JSON.stringify(req.body), function(err){
        if (err){
            console.log(err);
        } else {
            console.log('currentGame updated');
        }
    });

    res.send('success... probably...');
});

console.log('listening on port 8080...');
app.listen(8080);