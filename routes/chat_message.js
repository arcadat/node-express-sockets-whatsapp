import express from "express";
import multiparty from "connect-multiparty";
import { ChatMessageController } from "../controllers/index.js";
import { mwAuth } from "../middlewares/index.js";
import { Route } from "express";


const mdUpload = multiparty ({ uploadDir: "./uploads/images" });
const api = express.Router();


// Endpoints...
api.post("/chat/message/text", [mwAuth.asureAuth], ChatMessageController.sendText);
api.post("/chat/message/image", [mwAuth.asureAuth, mdUpload], ChatMessageController.sendImage);
api.get("/chat/messages/:chat_id", [mwAuth.asureAuth], ChatMessageController.getAllMessages);
api.get("/chat/messages/totals/:chat_id", [mwAuth.asureAuth], ChatMessageController.getCountMessages);
api.get("/chat/messages/last/:chat_id", [mwAuth.asureAuth], ChatMessageController.getLastMessage);



export const chatMessageRoutes = api;

