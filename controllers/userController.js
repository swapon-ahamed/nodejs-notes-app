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

// get single user 
module.exports.getUserController = async(req, res) => {
    try{
        const id = req.params.id;
        const users = await User.findByIdAndUpdate(id, req.body);
        if(!users) return res.status(404).send('User ID not found');
        res.send(users);
    }catch(err){
        res.status(500).send("Internal server error");
    }

};

// get all user 
module.exports.updateUserController = async(req, res) => {
    try{
        const id = req.params.id;
        const users = await User.findByIdAndUpdate(id, req.body);
        if(!users) return res.status(404).send('User ID not found');
            users.save();
        res.send(users);
    }catch(err){
        res.status(500).send("Internal server error");
    }

};

// delete user
module.exports.deleteUserController = 	async (req, res) => {
	let id = req.params.id;
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(400).send({errors: errors.array()})
	}
	const user = await User.findByIdAndDelete(id);
	if(!user){
		//delete
		res.status(404).send('404 Not Found.');
	}else{
		res.send(user);
	}
}

