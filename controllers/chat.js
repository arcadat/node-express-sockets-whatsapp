import { Chat, ChatMessage } from "../models/index.js";

// Functions
async function createChat(req, resp) {
    const { participant_id_one, participant_id_two } = req.body;

    const foundOne = await Chat.findOne ({
        participant_one: participant_id_one,
        participant_two: participant_id_two,
    });

    const foundTwo = await Chat.findOne ({
        participant_one: participant_id_two,
        participant_two: participant_id_one,
    });

    if (foundOne || foundTwo) {
        resp.status(200).send({msg: "Ya existe un chat registrado con esta persona"});
        return;
    }

    const chat = new Chat ({
        participant_one: participant_id_one,
        participant_two: participant_id_two
    });

    chat.save ((error, chatStorage) => {
        if (error) {
            resp.status(400).send({msg: "Error al crear el chat."});
        } else {
            resp.status(201).send(chatStorage);
        }
    });
}

async function getMyChats(req, resp) {
    const { user_id } = req.user;

    Chat.find ({
        $or: [{ participant_one: user_id }, { participant_two: user_id }],

    })
    .populate("participant_one")
    .populate("participant_two")
    .exec( async (error, chats) => {
        if (error) {
            return resp.status(400).send({msg: "Error al obtener los chats."});
        } else {

            const arrayChats = [];
            for await (const chat of chats) {
                const response = await ChatMessage.findOne({chat: chat._id})
                .select(["-password"])
                .sort({
                    createdAt: -1
                });

                arrayChats.push({
                    ...chat._doc,
                    last_message_date: response?.createdAt || null
                });

            }

            resp.status(200).send(arrayChats);
        }

    });
}

async function deleteChat (req, resp) {
    const chat_id = req.params.id;

    Chat.findByIdAndDelete(chat_id, (error) => {
        if (error) { 
            resp.status(400).send({msg: "Error al eliminar el chat."});
        } else {
            resp.status(200).send({msg: "Se ha eliminado el chat"});
        }
        
        
    });
}

async function getChat(req, resp) {
    const chat_id = req.params.id;
    
    Chat.findById(chat_id, (error, chatStorage) => {
        if (error) { 
            resp.status(400).send({msg: "Error al obtener el chat."});
        } else {
            resp.status(200).send(chatStorage);
        }

    })
    .populate("participant_one")
    .populate("participant_two")
}


export const ChatController = {
    // Export Functions
    createChat,
    getMyChats,
    deleteChat,
    getChat
};