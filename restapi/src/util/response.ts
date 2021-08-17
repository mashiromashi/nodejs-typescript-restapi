import { Response } from "express";

export class ResponseClass {
  private static jsonResponse<T>(res: Response, code: number, message?: T) {
    if (!!message) {
      return res.status(code).send(message);
    }
    return res.status(code);
  }

  public ok<T>(res: Response, data?: T) {
    return ResponseClass.jsonResponse(res, 200, data);
  }

  public create<T>(res: Response, data?: T) {
    return ResponseClass.jsonResponse(res, 201, data);
  }

  public notFound<T>(res: Response, data?: T) {
    return ResponseClass.jsonResponse(res, 404, data);
  }

  public serverError(res: Response) {
    return ResponseClass.jsonResponse(res, 500, {
      error: "Something went wrong, Please try again later!",
    });
  }

  public badRequest<T>(res: Response, data: T) {
    return ResponseClass.jsonResponse(res, 400, data);
  }

  public unAuthorized<T>(res: Response, data: T) {
    return ResponseClass.jsonResponse(res, 401, data);
  }
}
