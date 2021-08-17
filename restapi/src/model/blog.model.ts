import { Document, Schema, model } from "mongoose";
import { IUser } from "./user.model";

export interface IBlog extends Document {
  title: string;
  description: string;
  published: boolean;
  owner: IUser["_id"];
}

const blogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//delete password all of the response
blogSchema.set("toJSON", {
  transform: function (_, ret) {
    delete ret["__v"];
    return ret;
  },
});

export default model<IBlog>("Blog", blogSchema);
