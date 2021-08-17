import { Request, Response } from "express";
import { Login } from "../util/login";
import { Token } from "../util/token";
import { ResponseClass } from "../util/response";

import User from "../model/user.model";

let customResp: ResponseClass = new ResponseClass();

//register
const register = async (req: Request, res: Response): Promise<void> => {
  const user = new User(req.body);
  try {
    await user.save();
    customResp.create(res, { data: user });
  } catch (err: any) {
    if (err.code === 11000) {
      customResp.badRequest(res, { error: "email already exist" });
    }
    customResp.serverError(res);
  }
};

//login
const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    let auth = new Login(res, email, password);
    const user = await auth.findByCredentials();
    const token = await Token.generateToken(req.body.email);

    customResp.ok(res, { data: { user, token: token, expiresIn: "1hr" } });
  } catch (err: any) {
    customResp.unAuthorized(res, { error: "Unable to login" });
  }
};

//get all user
const getAllUsers = async (_: any, res: Response): Promise<void> => {
  try {
    const users = await User.find({});
    customResp.ok(res, { data: users });
  } catch (error) {
    customResp.serverError(res);
  }
};

//get login user
const getLoginUser = async (req: Request, res: Response): Promise<void> => {
  customResp.ok(res, { data: req.user });
};

//update the current login user
const updateUser = async (req: Request, res: Response): Promise<void> => {
  const updates: string[] = Object.keys(req.body);
  const allowUpdates: string[] = ["name", "email", "password", "age"];
  const isValidOperation: boolean = updates.every((update) =>
    allowUpdates.includes(update)
  );

  if (!isValidOperation) {
    customResp.badRequest(res, { error: "Invalid updates request" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    customResp.ok(res, { data: "Successfully updated" });
  } catch (err) {
    customResp.serverError(res);
  }
};

export default { register, login, getAllUsers, getLoginUser, updateUser };
