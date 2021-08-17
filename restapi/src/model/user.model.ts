import { Document, Schema, model } from "mongoose";
const bcrypt = require("bcryptjs");

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("blogs", {
  ref: "Blog",
  localField: "_id",
  foreignField: "owner",
});

//delete password all of the response
userSchema.set("toJSON", {
  transform: function (_, ret) {
    delete ret["password"];
    delete ret["__v"];
    return ret;
  },
});

//password hashing middleware before saving
userSchema.pre("save", async function (this: IUser, next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

export default model<IUser>("User", userSchema);
