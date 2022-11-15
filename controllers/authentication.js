const { User } = require("../models");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger")("auth controller");

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
    req.session.user = {
      username: existingUser.username,
      role: existingUser.role,
    };
    console.log(req.session);
    res.status(200).json({ user: existingUser });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const logout = (req, res) => {
  req.session.user.destroy();
  res.status(200).json({ message: "Logged out successfully!" });
};

module.exports = {
  login,
  logout,
};
