import jwt from "jsonwebtoken";

export type TVerifyToken = {
  exp: number;
  email: string;
};

export class Token {
  //generate token
  static generateToken = (email: string): string => {
    let expireTime: number = Math.floor(Date.now() / 1000) + 60 * 60;
    const token = jwt.sign(
      { exp: expireTime, email: email },
      "nodejs-with-typescript"
    );
    return token;
  };

  //verify the access token
  static verifyToken = (accessToken: any): TVerifyToken => {
    //not a good practice for token hasing
    //use .env
    const decoded: any = jwt.verify(accessToken, "nodejs-with-typescript");

    return decoded;
  };
}
