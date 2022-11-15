const { User } = require("../models");
const { ValidationError } = require("sequelize");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger")("user controller");

const index = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const store = async (req, res) => {
  // Existing User Check
  // Hashed Password
  // User Creation
  // Initialize session.user

  const { username, password, firstname, lastname } = req.body;
  try {
    // const existingUser = await User.findOne({ where: { username } });
    // if (existingUser) {
    //   return res.status(400).json({ message: "User already exists." });
    // }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      username,
      password: hashedPassword,
    });

    req.session.user = user;
    res.status(200).json({ user });
  } catch (error) {
    //logger.error(error);
    if (error instanceof ValidationError) {
      const { errors } = error;
      const e = errors.map((item) => {
        const { path, message } = item;
        const o = {};
        o[path] = message;
        return o;
      });
      console.log(e);
    }
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ where: { username } });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid Credentials." });
    }

    // need to remove password before sending to frontend
    delete existingUser.dataValues.password;
    delete existingUser._previousDataValues.password;
    console.log(existingUser);
    req.session.user = existingUser;
    res.status(200).json({ user: existingUser });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = {
  login,
  store,
  index,
};
