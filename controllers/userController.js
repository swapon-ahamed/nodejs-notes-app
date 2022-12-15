const {validationResult} = require('express-validator');
const User = require("../models/users");

// add User
module.exports.addUserController = async(req, res) => {
    const errors = validationResult(req);
    const user =  new User(req.body);
    if(!errors.isEmpty()){
        return res.status(400).send({errors: errors.array()})
    }
    try{
        await user.save();
        res.send(user);
    }catch(err){
        console.log(err)
        res.status(400).send(err);
    }
}

// get all user 
module.exports.getAllUserController = async(req, res) => {
    try{
        const users = await User.find();
        res.send(users);
    }catch(err){
        res.status(500).send("Internal server error");
    }

};

