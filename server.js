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

function validateNote(note) {
  if (!note.title || typeof note.title !== "string") {
    return false;
  }

  if (!note.text || typeof note.text !== "string") {
    return false;
  }
  return true;
}



app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {

    req.body.id = notes.length.toString();

    if (!validateNote(req.body)) {
      res.status(400).send("Be sure to type out your note and give it a title!");
    } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
    }
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
