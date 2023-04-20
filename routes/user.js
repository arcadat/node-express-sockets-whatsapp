import express from "express";
import multiparty from "connect-multiparty";

import { UserController } from "../controllers/index.js";
import { mwAuth } from "../middlewares/index.js";

const mdUpload = multiparty({uploadDir: "./uploads/avatars"});

const api = express.Router();

// endpoints
api.get("/user/me" , [mwAuth.asureAuth], UserController.getMe);
api.patch("/user/me" , [mwAuth.asureAuth, mdUpload], UserController.updateUserMe);
api.get("/user/:id" , [mwAuth.asureAuth], UserController.getUser);
api.get("/users" , [mwAuth.asureAuth], UserController.getUsers);
api.get("/users_non_group/:group_id", [mwAuth.asureAuth], UserController.getUsersNonGroup);


export const userRoutes = api;