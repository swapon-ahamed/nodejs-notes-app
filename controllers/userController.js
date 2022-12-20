const {validationResult} = require('express-validator');
const User = require("../models/users");
const bcrypt = require('bcryptjs');

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
        const users = await User.find({},['-password']);
        res.send(users);
    }catch(err){
        res.status(500).send("Internal server error");
    }

};

// get single user 
module.exports.getUserController = async(req, res) => {
    try{
        const id = req.params.id;
        const users = await User.findById(id, ['-password']);
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

// Login
module.exports.loginUserController = async(req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email:email});
        if(!user) return res.status(400).send('Login failed!');
        const isLogedIn = bcrypt.compare(password,user.password);
        if(!isLogedIn) return res.status(400).send('Login failed!');
        // generate token
        const token = user.generateAuthToken();
        // send as header
        // res.header('x-auth-token',token);
        res.cookie('auth',token, {httpOnly:true, sameSite: true, maxAge:4*60*60*1000, signed: true})

        res.send('Success');

    }catch(err){
        res.status(500).send(err);
    }

}

