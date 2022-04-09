const router = require('express').Router();
const path = require('path');

// render home page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/index.html"));
})

// render notes page
router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/notes.html"));
})

module.exports = router;