const express = require('express');
const app = express();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html')
});

app.listen(80)
console.log('service run at http://node.com:80/')