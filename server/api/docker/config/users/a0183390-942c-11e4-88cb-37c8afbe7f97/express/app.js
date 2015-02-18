var express = require('express');

// Constants
var PORT = 9090;

// App
var app = express();
app.get('/', function (req, res) {
  res.send('Hello world djhfkjdshfd\n');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
