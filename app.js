import express, { Router } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import morgan from "morgan";
import { initSocketServer } from "./utils/socketServer.js";
import { authRoutes, userRoutes, chatRoutes, chatMessageRoutes, groupsRoutes, groupMessageRoutes } from "./routes/index.js";

const app = express();
const server = http.createServer(app);
initSocketServer(server);

//Config Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Config Static Folder
app.use(express.static("uploads"));

//Config Header HTTP - CORS
app.use(cors());

//Config logger HTTP - REQUEST
app.use(morgan("dev"));

//Config routings
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", chatRoutes);
app.use("/api", chatMessageRoutes);
app.use("/api", groupsRoutes);
app.use("/api", groupMessageRoutes);



export { server };