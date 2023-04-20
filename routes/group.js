import express from "express";
import multiparty from "connect-multiparty";
import { GroupsController } from "../controllers/index.js";
import { mwAuth } from "../middlewares/index.js";


const mdUpload = multiparty({ uploadDir: "./uploads/groups" })

const api = express.Router();

// Endpoints
// Nota: Para evitar errores primero se colocan las url fijas y luego las variables (Ejemplo: api.patch("/group/ban" y api.patch("/group/:id" )
api.post("/group", [mwAuth.asureAuth, mdUpload ], GroupsController.createGroup);
api.get("/group", [mwAuth.asureAuth], GroupsController.getMyGroups);
api.get("/group/:id", [mwAuth.asureAuth], GroupsController.getGroup);
api.patch("/group/exit/:id", [mwAuth.asureAuth], GroupsController.exitGroup);
api.patch("/group/add_participants/:id", [mwAuth.asureAuth], GroupsController.addParticipants);
api.patch("/group/ban", [mwAuth.asureAuth], GroupsController.banParticipant);
api.patch("/group/:id", [mwAuth.asureAuth, mdUpload], GroupsController.updateGroup);


export const groupsRoutes = api;


