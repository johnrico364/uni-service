import { UserService } from "./user.service.js";

export const createUser = async (req, res) => {
  const userData = JSON.parse(req.body.data);
  const userImg = req.file?.filename;

  try {
    const user = await UserService.createUser(userData, userImg);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const signinUser = async (req, res) => {
  try {
    const user = await UserService.loginUser(req?.body);
    const token = await UserService.createToken(user._id);

    res.status(201).json({ success: true, jwt_token: token, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  const user_id = req.params.id;
  try {
    const user = await UserService.getUserById(user_id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const updatedUser = await UserService.updateUserById(req);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateUserStatusById = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  try {
    const updatedUser = await UserService.updateUserStatusById(id, status);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
