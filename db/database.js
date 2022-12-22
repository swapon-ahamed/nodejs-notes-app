const mongoose = require('mongoose');
const connectionDb = function () {
    mongoose.connect('mongodb://localhost:27017/notes-app', {
        useNewUrlParser: false
    }).then(() => {
        console.log("Database connected successfully");
    }).catch(err => console.log(err));
    mongoose.set('strictQuery', false);
}

module.exports = connectionDb;