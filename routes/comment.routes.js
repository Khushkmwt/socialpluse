import { Router } from "express";
const router = Router()
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createComment } from "../controller/comment.controller.js";

router.post("/:id",verifyJWT,createComment)

export default router