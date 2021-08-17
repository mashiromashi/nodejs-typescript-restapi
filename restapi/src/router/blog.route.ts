import { Router } from "express";
import auth from "../middleware/auth";
import controller from "../controller/blog.controller";

let router = Router();

//create blog
router.post("/blogs", auth, controller.createBlog);

//get all blogs
router.get("/blogs", auth, controller.getAllBlogs);

//get single blog by id
router.get("/blogs/:id", auth, controller.getSingleBlog);

//delete blog
router.delete("/blogs/:id", auth, controller.deleteBlog);

//update blog
router.put("/blogs/:id", auth, controller.updateBlog);

export default router;
