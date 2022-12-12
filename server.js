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





// var notes = [
// 	{
// 		id:1,
// 		title: "Note one",
// 		description: "Note one descriptions."
// 	},
// 	{
// 		id:2,
// 		title: "Note two",
// 		description: "Note two descriptions."
// 	},
// 	{
// 		id:3,
// 		title: "Note three",
// 		description: "Note two descriptions."
// 	},
// 	{
// 		id:4,
// 		title: "Note four",
// 		description: "Note two descriptions."
// 	}
// ];

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
	// if(note){
	// 	res.send(note);
	// }else{
	// 	res.status(404).send(`Not found note ID:${id}`);
	// }

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



	// let allowedDataKey = ['title', 'description'];
	// let id = req.params.id;
	// let noteData = req.body;
	// let dataKeys = Object.keys(noteData);
	// let isValid  = dataKeys.every(key => allowedDataKey.includes(key));
	// if(isValid){
	// 	const note = notes.find(note => note.id === id);
	// 	if(note){
	// 		notes = notes.map(note => {
	// 			if(note.id === id){
	// 				return {
	// 					...note,
	// 					...noteData
	// 				}
	// 			}else{
	// 				return note;
	// 			}
	// 		});
	// 			res.status(200).send(notes);
	// 	}else{
	// 		res.status(404).send("404 Not found");
	// 	}
	// }else{
	// 	res.status(500).send("Invalid data");
	// }
});

// delete note
app.delete('/note/:id', (req, res) => {
	let id = parseInt(req.params.id);
	const note = notes.find(note => note.id === id);
	if(note){
		//delete
		notes = notes.filter(note => note.id !== id);
		res.send(notes);
	}else{
		res.status(404).send('404 Not Found.');
	}
});



app.get('*', (req, res) => {
	res.status(404).send("404 not found")
});

const port = 3000;
app.listen(port, ()=>{
	console.log(`http://localhost:${port}`);
})