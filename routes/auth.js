const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({ error: 'User already exists' });
    }

    user = new User({ email, password: await bcrypt.hash(password, 10) });
    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;
