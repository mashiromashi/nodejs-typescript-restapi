import { ServerSetting } from "./app";
import { Database } from "./database/db";
import { ResponseClass } from "./util/response";

import userRouter from "./router/user.route";
import blogRouter from "./router/blog.route";

let server = new ServerSetting();
let database = new Database();
database.databaseConnect();

let express = server.getExpress();
express.use(userRouter);
express.use(blogRouter);
//if route does not exist
express.use(function (_, res) {
  let customResp = new ResponseClass();
  return customResp.notFound(res, { error: "Route Not Found!" });
});

server.start();
