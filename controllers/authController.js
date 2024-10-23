// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = new User({ name, email, password, role });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.status(201).json({ token ,name,email, role:user.role});
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

exports.login = async (req, res) => {
  try{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token ,name:user.name,email,role:user.role});
}
catch(err) {
  res.status(500).json({ error: err });
}
};
