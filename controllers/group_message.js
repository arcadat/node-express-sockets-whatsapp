import { GroupMessage } from "../models/group_message.js";
import {io, getFilePath} from "../utils/index.js";

//Functions
function sendText (req, resp) {
    const { group_id, message } = req.body;
    const { user_id } = req.user;
    
    const group_message = new GroupMessage ({
        group: group_id,
        user: user_id,
        message,
        type: "TEXT",
    });
    
    group_message.save(async (error) => {
        if (error) {
            resp.status(400).send({msg: "Error al enviar el mensaje."});
        } else {
            const data = await group_message.populate("user");
            
            // Emite un mensaje al socket del usuario o usuarios con quien esta chateando
            io.sockets.in(group_id).emit("message", data);
            // Notifica al usuario o usuarios que tiene un nuevo mensajes (En caso que no tenga abierto el chat)
            io.sockets.in(`${group_id}_notify`).emit("message_notify", data);
            
            resp.status(201).send({});
        }
    });
}

function sendImage (req, resp) {
    const { group_id } = req.body;
    const { user_id } = req.user;
    
    const group_message = new GroupMessage ({
        group: group_id,
        user: user_id,
        message: getFilePath(req.files.image) ,
        type: "IMAGE",
        
    });
    
    group_message.save(async (error) => {
        if (error) {
            resp.status(400).send({msg: "Error al enviar el mensaje."});
        } else {
            const data = await group_message.populate("user");
            
            // Emite un mensaje al socket del usuario o usuarios con quien esta chateando
            io.sockets.in(group_id).emit("message", data);
            // Notifica al usuario o usuarios que tiene un nuevo mensajes (En caso que no tenga abierto el chat)
            io.sockets.in(`${group_id}_notify`).emit("message_notify", data);
            resp.status(201).send({});
        }
    }); 

}

async function getAllMessages(req, resp) {
    const { group_id } = req.params;

    try {
        const messages = await GroupMessage.find({group: group_id}).sort({
            createdAt: 1
        }).populate("user");
       
        const total_msgs = await GroupMessage.find({group: group_id}).count();

        resp.status(200).send({messages, total: total_msgs});

        
    } catch (error) {
        resp.status(500).send({msg: "Error del servidor"});
        
    }

}


async function getCountMessages(req, resp) {
    const { group_id } = req.params;
    
    try {
        const count_msgs = await GroupMessage.find({group: group_id}).count();
        
        resp.status(200).send(JSON.stringify(count_msgs));
        
        
    } catch (error) {
        resp.status(500).send({msg: "Error del servidor"});
        
    }
    
}

async function getLastMessage(req, resp) {
    const { group_id } = req.params;

    try {
        const message = await GroupMessage.findOne({group: group_id}).sort({
            createdAt: -1
        }).populate("user");
       
        resp.status(200).send(message || {});

        
    } catch (error) {
        resp.status(500).send({msg: "Error del servidor"});
        
    }

}


export const GroupMessageController = {
    //Export functions
    sendText, 
    sendImage,
    getAllMessages,
    getCountMessages,
    getLastMessage

}
