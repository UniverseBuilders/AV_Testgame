var express = require('express')
var app = express()
var serveStatic = require('serve-static')

app.use(serveStatic('./'));

// accept POST request on the homepage
app.post('/', function (req, res) {
  res.send('Got a POST request');
  // TODO: handle the post
})

app.listen(8080)