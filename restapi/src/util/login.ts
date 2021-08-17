import User from "../model/user.model";
import { IUser } from "src/model/user.model";
import { Response } from "express";
import { ResponseClass } from "./response";

const bcrypt = require("bcryptjs");

interface ILogin {
  findByCredentials: Function;
}

export class Login implements ILogin {
  private customRes: ResponseClass;
  private email: string;
  private password: string;
  private res: Response;

  constructor(res: Response, email: string, password: string) {
    this.customRes = new ResponseClass();
    this.email = email;
    this.password = password;
    this.res = res;
  }

  //check email and password when login
  public findByCredentials = async (): Promise<
    Response<any, Record<string, any>> | IUser
  > => {
    const user: IUser | null = await User.findOne({ email: this.email });

    if (!user) {
      return this.customRes.unAuthorized(this.res, {
        error: "Unable to login! Check your email or password",
      });
    }
    const isMatch = await bcrypt.compare(this.password, user.password);
    if (!isMatch) {
      return this.customRes.unAuthorized(this.res, {
        error: "Unable to login! Check your email or password",
      });
    }

    return user;
  };
}
