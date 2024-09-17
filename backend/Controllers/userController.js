const UserModel = require('../Models/User');
const bcrypt = require('bcrypt');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Update an existing user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { name, email },
      { new: true } // Return the updated user
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
