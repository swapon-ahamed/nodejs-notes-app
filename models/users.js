const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate:{
            validator(value){
                return validator.isEmail(value)
            },
            message: "Must be a vaid email"
        }
    },
    password: {
        type: String,
        required: true,
        minLength:6,
        validate: {
            validator(value){
                return !value.toLowerCase().includes('password')
            },
            message: "Password must not contain 'password'"
        }
    }
})

userSchema.pre('save', async function(next) {
    // this cope available

    if( !this.isModified('password')){
        const hashPassword = await bcrypt.hash(this.password,10);
        this.password = hashPassword;
        next();
    }

});
const User = mongoose.model('User', userSchema);
module.exports = User;