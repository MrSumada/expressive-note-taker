const fs = require('fs');
const path = require('path');

const express = require('express');
const { notes } = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// Create a new note, used for POST 
function createNewNote(body, notesArray) {

  const note = body;
  notesArray.push(note);

  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );

  return note;
}

// Validate a new note, used for POST
function validateNote(note) {
  if (!note.title || typeof note.title !== "string") {
    return false;
  }

  if (!note.text || typeof note.text !== "string") {
    return false;
  }
  return true;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
})

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
})

app.post('/api/notes', (req, res) => {

    // get unique id based on last note added 
    // (rather than the array length, which can vary depending on deletions)
    const lastEl = notes[notes.length - 1];
    const lastId = parseInt(lastEl.id) + 1;
    req.body.id = lastId.toString();

    if (!validateNote(req.body)) {
      res.status(400).send("Be sure to type out your note and give it a title!");
    } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
    }
})

app.delete('/api/notes/:id', (req, res) => {

  // read old array
  fs.readFile(__dirname + '/db/db.json', (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    // find index based on id, and splice index
    const { id } = req.params;
    const index = notes.findIndex(note => note.id === id);
    notes.splice(index, 1);

    // write new array
    fs.writeFile('./db/db.json', JSON.stringify({ notes: notes }, null, 4), (err) => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(notes);
    });
  });
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
