import { UserService } from "./user.service.js";

export const createUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const signinUser = async (req, res) => {
  try {
    const user = await UserService.loginUser(req.body);
    const token = await UserService.createToken(user);

    res.status(201).json({ success: true, jwt_token: token, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
