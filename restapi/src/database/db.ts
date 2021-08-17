import mongoose from "mongoose";

export class Database {
  databaseConnect(): void {
    try {
      mongoose.connect("mongodb://127.0.0.1:27017/nodejs-typescript", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      });
    } catch {
      console.log("Database connect error");
    }
  }
}
