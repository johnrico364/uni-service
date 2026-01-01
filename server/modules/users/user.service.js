import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import User from "./user.model.js"; // Model

export const UserService = {
  // CREATE TOKEN ==================================================================
  async createToken(user_id) {
    return jwt.sign({ user_id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  },

  // CREATE USER =================================================================
  async createUser(data, userImage) {
    let img_path;
    if (userImage) {
      img_path = path.join("images/users", userImage);
    }

    // Validations
    if (!validator.isEmail(data.email)) {
      fs.unlink(img_path, (err) => {
        if (err) throw err;
        console.log("user img delete");
      });
      throw Error("Invalid Email Format");
    }
    if (!validator.isStrongPassword(data.password)) {
      fs.unlink(img_path, (err) => {
        if (err) throw err;
        console.log("user img delete");
      });
      throw Error(
        "Password must contains one capital letter and one special character"
      );
    }

    const checkEmail = await User.findOne({ email: data.email });
    if (checkEmail) {
      throw Error("Email already exists");
    }

    // Hash and Salt Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    // Create User
    const createUser = await User.create({
      ...data,
      password: hashPassword,
      profile_image: userImage,
    });
    return createUser;
  },

  // LOGIN USER ==================================================================
  async loginUser(data) {
    // Validations
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw Error("Email not found");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw Error("Invalid password");
    }

    return user;
  },

  // GET ALL USERS ================================================================
  async getAllUsers() {
    const users = await User.find({
      role: { $in: ["user", "service_provider"] },
    });
    return users;
  },

  // GET USER BY ID ================================================================
  async getUserById(user_id) {
    const user = await User.findById(user_id);
    return user;
  },

  // UPDATE USER BY ID ==============================================================
  async updateUserById(req) {
    const id = req.params.id;
    const newUser = JSON.parse(req.body.data);
    const userImg = req.file?.filename;
    const oldImg = req.body?.oldImg;

    if (userImg) {
      const oldImagePath = path.join("images/users", oldImg);
      fs.unlink(oldImagePath, (err) => {
        if (err) throw err;
        console.log("old img delete");
      });
    }

    const response = await User.findByIdAndUpdate(
      id,
      {
        ...newUser,
        profile_image: userImg ? userImg : oldImg,
      },
      { new: true }
    );

    return response;
  },

  // UPDATE USER STATUS BY ID =======================================================
  async updateUserStatusById(user_id, status) {
    const response = await User.findByIdAndUpdate(
      user_id,
      { status },
      {new: true, runValidators: true }
    );
    return response;
  },
};
