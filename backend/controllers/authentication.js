const User = require('../models/Users/user');
const bcrypt = require('bcrypt-nodejs');
const tokenForUser = require('../utils/tokengenerator');

// Sign in
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: '****' }); // Mask the password for security

    if (!email || !password) {
      console.log('Missing email or password');
      return res.send({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.send({ message: 'Incorrect password or email' });
    }

    console.log('User found:', user);

    const auth = bcrypt.compareSync(password, user.password);
    if (!auth) {
      console.log('Password does not match for user:', email);
      return res.send({ message: 'Incorrect password or email' });
    }

    // Check for patrol supervisor or admin role
    if (user.role !== 'patrol_supervisor' && user.role !== 'ADMIN') {
      console.log('Access forbidden for user:', email);
      return res.status(403).send({ message: 'Access forbidden: Only supervisors and admins can log in here' });
    }

    const token = tokenForUser(user);
    console.log('Token generated for user:', email);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.send({ message: "User logged in successfully", token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ message: error.message });
  }
}
