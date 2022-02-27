const fs = require('fs');
const path = require('path');

const express = require('express');
const { notes } = require('./db/db');

const PORT = process.env.PORT || 3001;
const app = express();
// const apiRoutes = require('./routes/apiRoutes');
// const htmlRoutes = require('./routes/htmlRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Use apiRoutes
// app.use('/api', apiRoutes);
// app.use('/', htmlRoutes);

function createNewNote(body, notesArray) {

  const note = body;
  notesArray.push(note);

  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );

  return note;
}

// function deleteNote(body, notesArray) {

//   const { id } = body.params;
//   const notesIndex = notes.findIndex(p => p.id == id);

//   notes.splice(notesIndex, 1);

//   return res.json();


// }

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

    req.body.id = notes.length.toString();

    if (!validateNote(req.body)) {
      res.status(400).send("Be sure to type out your note and give it a title!");
    } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
    }
})

app.delete('/api/notes/:id', (req, res) => {
  const deletedNoteId = req.params.id;
  fs.readFile(__dirname + '/db/db.json', (err, data) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    const newNotes = JSON.parse(data);

    for (var i = 0; i < newNotes.length; i++) {
      if (newNotes[i].id === deletedNoteId) {
        newNotes.splice(i, 1);
        return;
      }
    }

    fs.writeFile(__dirname + '/db/db.json', JSON.stringify(newNotes), (err) => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(newNotes);
    });
  });
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
