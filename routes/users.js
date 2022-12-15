const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const {addUserController,getAllUserController} = require('../controllers/userController');

router.get('/', getAllUserController);

router.post('/', 
    [
        check('firstName', 'First name is required').notEmpty(),
        check('lastName', 'Last name is required').notEmpty(),
        check('email', 'Email is required').notEmpty(),
        check('email', 'Email is must be valid').isEmail(),
        check('password', 'Password is required').notEmpty(),
        check('password', 'Password length minimum 6 character').isLength({min:6}),
        check('confirmPassword', 'Confirm password is required').notEmpty(),
        check('confirmPassword').custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error('Confrim password dont match');
            }else if(value.toLowerCase().includes('password')){
                throw new Error('password not allow');
            }
            else{
                return true;
            }
        })
    ],
    addUserController
);
module.exports = router;