const mongoose = require('mongoose');
// const notesSchema = new mongoose.Schema({
//     title: String,
//     description: String
// },{
//     timestamps: true
// });


const notesSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true,'Title is required'],
        minlength:[3, 'Title muest be 3 character minimum'],
        maxlength:[255, 'Title maximum 255 character'],
    },
    description:{
        type: String,
        minlength:[3, 'Title muest be 3 character minimum'],
        maxlength: 1024
    }
},{
    timestamps: true
});

const Note = mongoose.model('Note',notesSchema);
module.exports = Note;