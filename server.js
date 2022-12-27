const express = require('express');
const app = express();
const connectionDb = require('./db/database');

//Middleware
const {auth} = require('./middleware/auth');
const {validationResult} = require('express-validator');
const cookieParser = require('cookie-parser');

// models
const Note = require('./models/notes');

// middleware
app.use(express.json());


// Route
const indexRoute = require('./routes/index');
const notesRoute = require('./routes/notes');
const usersRoute = require('./routes/users');

// connecting database
connectionDb();

app.use(cookieParser('secretKey'));
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