import User, { IUser } from "../model/user.model";
import { NextFunction, Request, Response } from "express";
import { Token, TVerifyToken } from "../util/token";
import { ResponseClass } from "../util/response";

declare global {
  namespace Express {
    interface Request {
      user: any;
      token: any;
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  let customRes = new ResponseClass();
  try {
    const checkType: boolean | undefined = req
      .header("Authorization")
      ?.includes("Bearer");
    if (!checkType) {
      customRes.badRequest(res, {
        error: "Please support the bearer token type",
      });
    }
    const token: string | undefined = req
      .header("Authorization")
      ?.replace("Bearer ", "");

    //verify the token
    const decoded: TVerifyToken = Token.verifyToken(token);

    const user: IUser | null = await User.findOne({
      email: decoded.email,
    });
    if (!user) {
      customRes.unAuthorized(res, { error: "Please Authenticate" });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    customRes.unAuthorized(res, { error: "Please Authenticate" });
  }
};

export default auth;
