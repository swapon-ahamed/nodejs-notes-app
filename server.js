const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {check, validationResult} = require('express-validator');

// models
const Note = require('./models/notes');

// controller
const {addNoteController,getNotesController,updateNoteController,deleteNoteController} = require("./controllers/noteController");

// middleware
app.use(express.json());

// connecting database
mongoose.connect('mongodb://localhost:27017/notes-app',{
	useNewUrlParser: false
}).then(() => {
	console.log("Database connected successfully");
}).catch(err => console.log(err));
mongoose.set('strictQuery', false);


//home page
app.get("/", getNotesController);

// get for all notes
app.get("/notes",getNotesController);

// for single note
app.get('/notes/:id', 
	[
		check('id', 'Note not found').isMongoId()
	],
	async(req, res) => {
	let id = req.params.id;
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(404).send(errors.array());
	}
	try{
		const note = await Note.findById(id);
		if(!note) return res.status(404).send('No note found');
		return res.send(note);
	}catch(error){
		return res.status(500).send(error);
	}


});

// add note and return all notes
app.post('/note', 
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
app.put('/note/:id', 
[
	check('id','Not found note').isMongoId(),
	check('title', 'Title is rquired').notEmpty(),
	check('description', 'description is rquired').optional().notEmpty()
],
updateNoteController
);

// delete note
app.delete('/note/:id', 
	check('id', 'Note not found').isMongoId(),
	deleteNoteController
);

app.get('*', (req, res) => {
	res.status(404).send("404 not found")
});

const port = 3000;
app.listen(port, ()=>{
	console.log(`http://localhost:${port}`);
})