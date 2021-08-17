import express from "express";
import cors from "cors";

interface IServer {
  start: Function;
}

export class ServerSetting implements IServer {
  private express = express.application;
  private port: number = 4000;

  constructor() {
    this.express = express();
    this.middleware();
  }

  private middleware = (): void => {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
  };

  getExpress = (): express.Application => {
    return this.express;
  };

  public start = (): void => {
    this.express.listen(this.port, () => {
      console.log(`Server is running http://localhost:${this.port}`);
    });
  };
}
