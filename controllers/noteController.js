const {validationResult} = require('express-validator');
const Note = require("../models/notes");

// add note
module.exports.addNoteController = async(req, res) => {
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
}

// get all notes
module.exports.getNotesController = async(req, res) => {
	// res.send(notes);
	try{
		const notes = await Note.find();
		res.send(notes);
	}catch(error){
		res.status(500).send(error);
	}
}

// update note
module.exports.updateNoteController = async(req, res) => {
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
}

// delete note
module.exports.deleteNoteController = 	async (req, res) => {
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
}