const express = require('express');
const app = express();
var path = require('path');

const port = 3000;

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.use(express.static('public'));

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});
