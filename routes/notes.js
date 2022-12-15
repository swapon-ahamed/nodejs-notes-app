const express = require('express');
const router = express.Router();
const {addNoteController,getNoteController,getNotesController,updateNoteController,deleteNoteController} = require("../controllers/noteController");
const {check} = require('express-validator');
//home page
// router.get("/", getNotesController);

// get for all notes
// router.get("/",getNotesController);

// for single note
router.get('/:id', 
	[
		check('id', 'Note not found').isMongoId()
	],
	getNoteController
);

// add note and return all notes
router.post('/', 
	[
		// check('title').notEmpty().withMessage('Title is required').isLength({min: 3, max: 255}).withMessage('Title is required and must 3 to 255 characters.'),
		// check('description').notEmpty().isLength({min: 3, max: 512}).withMessage('Description is required and must 3 to 512 characters.'),
		check('title', 'Title is rquired').notEmpty(),
		check('description', 'description is rquired').notEmpty()
	],
	// controller
	addNoteController
);

// update notes
router.put('/:id', 
[
	check('id','Not found note').isMongoId(),
	check('title', 'Title is rquired').notEmpty(),
	check('description', 'description is rquired').optional().notEmpty()
],
updateNoteController
);



// delete note
router.delete('/:id', 
	check('id', 'Note not found').isMongoId(),
	deleteNoteController
);

module.exports = router;