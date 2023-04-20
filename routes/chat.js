import express from "express";
import { ChatController } from "../controllers/index.js";
import { mwAuth } from "../middlewares/index.js";

const api = express.Router();

// endpoints
api.post("/chat", [ mwAuth.asureAuth ], ChatController.createChat);
api.get("/chat", [ mwAuth.asureAuth ], ChatController.getMyChats);
api.delete("/chat/:id", [ mwAuth.asureAuth ], ChatController.deleteChat);
api.get("/chat/:id", [ mwAuth.asureAuth ], ChatController.getChat);

export const chatRoutes = api;