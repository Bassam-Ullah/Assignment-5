import express from "express";

const router = express.Router();

// import {
//   getUsers,
//   postUser,
//   updateUser,
//   deleteUser,
// } from "../controllers/userControllers";
const usersController = require("../controllers/usersController");

router.get("/", usersController.getUsers);
router.post("/user", usersController.postUser);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

export default router;
