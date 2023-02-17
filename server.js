const express = require('express');
const path = require('path');
const fs = require('fs');
let db = require('./db/db.json');
const uuid = require('./public/assets/js/uuid');

const PORT = process.env.PORT || 3001;

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
  res.json(db);
});
app.post('/api/notes', (req, res) => {  
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        db = JSON.parse(data);
        db.push(newNote);
        fs.writeFile(
          './db/db.json',
          JSON.stringify(db),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
        res.json(newNote);
      }
    });
  } else {
    res.status(500).json('Error in posting note');
  }
});
app.delete('/api/notes/:id', (req, res) => {
  res.json(`${req.method} request received`);
  console.info(`${req.method} request received`);
  const { id } = req.params;
  const projectIndex = db.findIndex(p => p.id == id);
  db.splice(projectIndex, 1);
  fs.writeFile(
    './db/db.json',
    JSON.stringify(db),
    (writeErr) =>
      writeErr
        ? console.error(writeErr)
        : console.info('Successfully updated notes!')
  );
  return res.send();
})


app.listen(PORT, () => {
    console.log(`Note taker app listening at http://localhost:${PORT}`);
  });