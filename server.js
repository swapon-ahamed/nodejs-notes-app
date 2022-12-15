const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {validationResult} = require('express-validator');

// models
const Note = require('./models/notes');

// middleware
app.use(express.json());

// Route
const indexRoute = require('./routes/index');
const notesRoute = require('./routes/notes');
const usersRoute = require('./routes/users');

// connecting database
mongoose.connect('mongodb://localhost:27017/notes-app',{
	useNewUrlParser: false
}).then(() => {
	console.log("Database connected successfully");
}).catch(err => console.log(err));
mongoose.set('strictQuery', false);


// Handling routes
app.use('/', indexRoute);
app.use('/notes', notesRoute);
app.use('/users', usersRoute);


app.get('*', (req, res) => {
	res.status(404).send("404 not found")
});

const port = 3000;
app.listen(port, ()=>{
	console.log(`http://localhost:${port}`);
})