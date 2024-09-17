const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Route to get all users
router.get('/', UserController.getAllUsers);

// Route to create a new user
router.post('/', UserController.createUser);

// Route to update an existing user
router.put('/:id', UserController.updateUser);

// Route to delete a user
router.delete('/:id', UserController.deleteUser);

module.exports = router;
