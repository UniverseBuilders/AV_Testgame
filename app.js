var express = require('express');
var app = express();
var serveStatic = require('serve-static');
var fs = require('fs');
var bodyParser = require('body-parser')

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
});

console.log('listening on port 8080...');
app.listen(8080);