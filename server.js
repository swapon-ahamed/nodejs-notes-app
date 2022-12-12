const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {check, validationResult} = require('express-validator');

// models
const Note = require('./models/notes');

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
app.get("/", async(req, res) => {
	// res.send(notes);
	try{
		const notes = await Note.find();
		res.send(notes);
	}catch(error){
		res.status(500).send(error);
	}
});

// get for all notes
app.get("/notes", async(req, res) => {
	try{
		const notes = await Note.find();
		res.send(notes);
	}catch(error){
		res.status(500).send(error);
	}
});

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
	async(req, res) => {
		const errors = validationResult(req);
		const note =  new Note(req.body);
		if(!errors.isEmpty()){
			return res.status(400).send({errors: errors.array()})
		}
		try{
			await note.save();
			res.send(note);
		}catch(err){
			console.log(err)
			res.status(400).send(err);
		}
});


// update notes
app.put('/note/:id', 
[
	check('id','Not found note').isMongoId(),
	check('title', 'Title is rquired').notEmpty(),
	check('description', 'description is rquired').optional().notEmpty()
],

async(req, res) => {
	const id = req.params.id;
	let dataKeys = Object.keys( req.body);
	let allowedDataKey = ['title', 'description'];
	let isValid  = dataKeys.every(key => allowedDataKey.includes(key));
	if(!isValid) return res.status(400).send('Invalid update');
		const errors = validationResult(req);
		if(!errors.isEmpty()){
			return res.status(400).send({errors: errors.array()})
		}
	try{
		const note = await Note.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true
		});
		if(!note) return res.status(404).send('Note not found');
		res.send(note);
	}catch(error){
		res.status(500).send(error);
	}
});

// delete note
app.delete('/note/:id', 
	check('id', 'Note not found').isMongoId(),

	async (req, res) => {
	let id = req.params.id;
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(400).send({errors: errors.array()})
	}
	const note = await Note.findByIdAndDelete(id);
	if(!note){
		//delete
		res.status(404).send('404 Not Found.');
	}else{
		res.send(note);
	}
});


app.get('*', (req, res) => {
	res.status(404).send("404 not found")
});

const port = 3000;
app.listen(port, ()=>{
	console.log(`http://localhost:${port}`);
})