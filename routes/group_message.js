import express from "express";
import multiparty from "connect-multiparty";
import { GroupMessageController } from "../controllers/index.js";
import { mwAuth } from "../middlewares/index.js";


const mdUpload = multiparty ({ uploadDir: "./uploads/images" });
const api = express.Router();


//Endpoints
api.post("/group/message/text", [mwAuth.asureAuth], GroupMessageController.sendText);
api.post("/group/message/image", [mwAuth.asureAuth, mdUpload], GroupMessageController.sendImage);
api.get("/group/messages/:group_id", [mwAuth.asureAuth], GroupMessageController.getAllMessages);
api.get("/group/messages/totals/:group_id", [mwAuth.asureAuth], GroupMessageController.getCountMessages);
api.get("/group/messages/last/:group_id", [mwAuth.asureAuth], GroupMessageController.getLastMessage);

export const groupMessageRoutes = api;