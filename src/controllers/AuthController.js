import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(req.body.password, salt);
  req.body.password = passwordHash;
  const newUser = new User(req.body);
  const { email } = req.body;

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) return res.status(400).json("Email already registered");
    const user = await newUser.save();

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      // if (!validity) res.status(400).json({ message: "Wrong Password" });
      // else {
      //   const token = jwt.sign(
      //     {
      //       email: user.email,
      //       id: user._id,
      //     },
      //     process.env.JWT_KEY,
      //     { expiresIn: "1h" }
      //   );
      //   res.status(200).json({ user, token });
      // }
      validity
        ? (() => {
            const token = jwt.sign(
              {
                email: user.email,
                id: user._id,
              },
              process.env.JWT_KEY,
              { expiresIn: "1h" }
            );
            res.status(200).json({ user, token });
          })()
        : res.status(400).json({ message: "Wrong Password" });
    } else {
      res.status(400).json({ message: "User doesn't exist" });
    }
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
