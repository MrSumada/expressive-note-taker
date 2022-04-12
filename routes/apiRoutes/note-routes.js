const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { notes } = require("../../db/db.json");
const { v4: uuidv4 } = require('uuid');


// GET existing notes from the db
router.get('/', (req, res) => {
    res.json(notes);
});


// POST new note to the db and the page
router.post('/', (req, res) => {

    // write notes from db and new note into array
    function createNewNote(body, notesArray) {

        const note = body;
        notesArray.push(note);

        fs.writeFileSync(
            path.join(__dirname, '../../db/db.json'),
            JSON.stringify({ notes: notesArray }, null, 2)
        );

        return note;
    }

    // validate that note's title and text exist
    function validateNote(note) {
        if (!note.title || typeof note.title !== "string") {
            return false;
        }

        if (!note.text || typeof note.text !== "string") {
            return false;
        }
        return true;
    }

    // get unique id
    req.body.id = uuidv4();

    // check for validation
    if (!validateNote(req.body)) {
        res.status(400).send("Be sure to type out your note and give it a title!");
    } else {
        const note = createNewNote(req.body, notes);
        res.json(note);
    }
})

// Delete button route
router.delete('/:id', (req, res) => {
    // read old array
    fs.readFile(path.join(__dirname, '../../db/db.json'), (err, data) => {
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
    fs.writeFile(path.join(__dirname, '../../db/db.json'), JSON.stringify({ notes: notes }, null, 4), (err) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.json(notes);
        });
    });
});

module.exports = router;