const express = require('express');
const path = require('path');
const db = require('./db/db.json');

const PORT = 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
app.get('/api/notes', (req, res) => {
    return res.json(db);
});
app.post('/api/reviews', (req, res) => {
    let response;
    if (req.body && req.body.title) {
      response = {
        status: 'success',
        data: req.body,
      };
      res.json(`Note ${response.data.title} has been added!`);
    } else {
      res.json('Request body must at least contain a note title');
    }
    console.log(req.body);
  });


app.listen(PORT, () => {
    console.log(`Note taker app listening at http://localhost:${PORT}`);
  });