import mongoose from "mongoose";
import { server } from "./app.js";
import { IP_SERVER, PORT, DB_USER, DB_PWD, DB_HOST } from "./constans.js";
import { io } from "./utils/index.js";

const mongoDBURL = `mongodb+srv://${DB_USER}:${DB_PWD}@${DB_HOST}/`;

//DB MONGO Local
const mongoDBLocal = "mongodb://localhost/arcachat";

mongoose.connect(mongoDBURL, (error) => {
    if (error) throw error;
    server.listen(PORT, () => {
        console.log("##########################");
        console.log("###### API ARCACHAT ######");
        console.log("##########################");
        console.log (`http://${IP_SERVER}:${PORT}/api`);
    
        io.sockets.on ("connection", (socket) => {
            console.log ("NUEVO USUARIO CONECTADO");
    
            socket.on("disconnect", () => {
                console.log ("USUARIO DESCONECTADO");
            });
    
            socket.on("subscribe", (room) => {
                socket.join(room);
            });
    
            socket.on("unsubscribe", (room) => {
                socket.leave(room);
            });
    
        });
    });
});
