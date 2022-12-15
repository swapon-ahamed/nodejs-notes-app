const express = require('express');
const router = express.Router();
const {addNoteController,getNoteController,getNotesController,updateNoteController,deleteNoteController} = require("../controllers/noteController");

// get for all notes
router.get("/",getNotesController);

module.exports = router;