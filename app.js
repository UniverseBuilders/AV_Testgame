var express = require('express');
var app = express();
var serveStatic = require('serve-static');
var fs = require('fs');

// serve static pages
app.use(['gameData','css', 'js', '/'], serveStatic('./', {'index': ['index.html']}));

// accept POST request for updating the game
app.post('/uploadCurrentGame', function (req, res) {
    console.log(req.body);

    /*
    TODO: save the file (once req.body is working correctly...
    fs.writeFile('gameData/currentGame.json', JSON.stringify(req.body), function(err){
        if (err){
            console.log(err);
        } else {
            console.log('currentGame updated');
        }
    });
    */

});

app.listen(8080);