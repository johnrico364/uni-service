import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "./user.model.js"; // Import User Model

export const UserService = {
  // CREATE TOKEN ==================================================================
  async createToken(user_id) {
    return jwt.sign({ user_id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  },

  // CREATE USER =================================================================
  async createUser(data) {
    // Validations
    if (!validator.isEmail(data.email)) {
      throw Error("Invalid Email Format");
    }
    if (!validator.isStrongPassword(data.password)) {
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
    const createUser = await User.create({ ...data, password: hashPassword });
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
    const users = await User.find({role: {$in: ['user', 'service_provider']}});
    return users;
  },

  // GET USER BY ID ================================================================
  async getUserById(user_id) {
    const user = await User.findById(user_id);
    return user;
  }

  
};
