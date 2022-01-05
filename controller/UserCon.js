const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
//user imports
const User = require("../model/UserMdl");
const { signAccessToken, verifyAccessToken } = require("../helper/jwt");

exports.postSignup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const newUser = await new User({
      email: email ? email.toString() : email,
      password: password ? password.toString() : password,
    }).save();
    if (newUser) {
      signAccessToken(newUser._id)
        .then((token) => {
          return res.status(200).json({
            message: "Signup successfully",
            user: { email: email, userId: newUser.id, token: token },
          });
        })
        .catch((err) => {
          return next(new Error("Server Error"));
        });
    }
  } catch (err) {
    return next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const findUser = await User.findOne({ email: email.toString() });
      if (findUser) {
        bcrypt.compare(password, findUser.password).then((result) => {
          if (result) {
            signAccessToken(findUser._id)
              .then((token) => {
                return res.status(200).json({
                  message: "login Successfull",
                  user: {
                    email: findUser.email,
                    userId: findUser.id,
                    token: token,
                  },
                });
              })
              .catch((err) => {
                return next(new Error("server error"));
              });
          } else {
            return res
              .status(400)
              .json({ message: "Invalid email or password!" });
          }
        });
      } else {
        return res.status(400).json({ message: "Invalid email or password!" });
      }
    } else {
      return res.status(400).json({ message: "Invalid email or password!" });
    }
  } catch (error) {
    return next(error);
  }
};

exports.checkAuth = async (req, res, next) => {
  const userId = req.userId;
  try {
    const findUser = await User.findById(mongoose.Types.ObjectId(userId));
    if (findUser) {
      return res.status(200).json({ message: "success", status: true });
    }
    return res.status(400).json({ message: "failed", status: false });
  } catch (error) {
    return next(error);
  }
};
