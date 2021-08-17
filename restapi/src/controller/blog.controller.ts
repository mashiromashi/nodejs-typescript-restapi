import { Request, Response } from "express";
import Blog, { IBlog } from "../model/blog.model";
import mongoose from "mongoose";
import { ResponseClass } from "../util/response";

let customResp: ResponseClass = new ResponseClass();

//create blog
const createBlog = async (req: Request, res: Response): Promise<void> => {
  const blog: IBlog = new Blog({ ...req.body, owner: req.user._id });
  try {
    await blog.save();
    customResp.create(res, { data: blog });
  } catch (err) {
    customResp.badRequest(res, { error: err.message });
  }
};

//get all blogs
const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  const match: any = {};
  if (req.query.published) {
    match.published = req.query.published === "true";
  }
  try {
    await req.user
      .populate({
        path: "blogs",
        match,
        options: {
          limit: parseInt(req.query.limit as string),
          skip: parseInt(req.query.skip as string),
          sort: {
            createdAt: -1,
          },
        },
      })
      .execPopulate();
    customResp.ok(res, { data: req.user.blogs });
  } catch (err) {
    customResp.serverError(res);
  }
};

//get single blog
const getSingleBlog = async (req: Request, res: Response): Promise<void> => {
  let id = mongoose.Types.ObjectId(req.params.id);
  const userId = req.user._id;
  try {
    const blog: IBlog[] = await Blog.aggregate([
      { $match: { $and: [{ _id: id }, { owner: userId }] } },
      {
        $project: {
          __v: 0,
        },
      },
    ]);
    if (blog.length > 0) {
      //mongo aggregation always return array
      //if u want to tranform object just pick the first index of array
      customResp.ok(res, { data: blog[0] });
    }
    customResp.notFound(res, { data: "Content Not Found" });
  } catch (error) {
    customResp.serverError(res);
  }
};

//delete blog
const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Blog.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      customResp.notFound(res, { error: "Blog post not found" });
    }
    customResp.ok(res, { data: "Successfully Deleted" });
  } catch (error) {
    customResp.serverError(res);
  }
};

//update blog
const updateBlog = async (req: Request, res: Response): Promise<void> => {
  const updates: string[] = Object.keys(req.body);
  const allowUpdates: string[] = ["title", "description", "published"];
  const isValidOperation: boolean = updates.every((update) =>
    allowUpdates.includes(update)
  );

  if (!isValidOperation) {
    customResp.badRequest(res, { error: "Invalid updates request" });
  }

  const _id = req.params.id;
  try {
    const blog: IBlog | any = await Blog.findOne({ _id, owner: req.user._id });
    if (!blog) {
      customResp.notFound(res, { error: "Blog content not found" });
    }

    updates.forEach((update) => (blog[update] = req.body[update]));
    await blog.save();
    customResp.ok(res, { data: blog });
  } catch (err) {
    res.status(400).send(err);
  }
};

export default {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  deleteBlog,
  updateBlog,
};
