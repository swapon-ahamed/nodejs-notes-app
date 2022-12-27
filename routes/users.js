const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const {auth} = require('../middleware/auth');
const {
    addUserController,
    getAllUserController,
    getUserController,
    updateUserController,
    deleteUserController,
    loginUserController,
    logoutUserController
    } = require('../controllers/userController');

// get all users
router.get('/', getAllUserController);

// get single user
router.get('/me', auth, getUserController);

// add user
router.post('/', 
    [   
        auth,
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

// update users
router.put('/:id', 
[
    auth,
	check('id','Not found note').isMongoId(),
	check('firstName', 'first name is rquired').optional().notEmpty(),
	check('lastName', 'last name is rquired').optional().notEmpty()
],
updateUserController
);

// delete user
router.delete('/:id', 
    [   auth,
	    check('id', 'Note not found').isMongoId()
    ],
	deleteUserController
);

router.post("/login",loginUserController);
router.get("/logout",auth, logoutUserController);

module.exports = router;