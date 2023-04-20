import { Group, User } from "../models/index.js";
import { getFilePath } from  "../utils/index.js";


async function getMe(req, resp) {
    const { user_id } = req.user;
    const response_me = await User.findById(user_id).select(["-password"]);
    
    try {
        if (!response_me) {
            resp.status(400).send({msg: "No se ha encontrado el usuario."});
        } else {
            resp.status(200).send(response_me);
        }
    } catch (error) {
        resp.status(500).send({msg: "Error del servidor."});        
    }
}

async function updateUserMe(req, resp) {
    
    const { user_id } = req.user;
    const userData = req.body;

    if (req.files.avatar) {
        const imgPath = getFilePath(req.files.avatar)
        userData.avatar = imgPath;
        console.log(imgPath);
    }

    User.findByIdAndUpdate({_id: user_id}, userData, (error) => {
        if (error) {
            resp.status(400).send({msg: "Error al actualizar datos del usuario."});
        } else {
            resp.status(200).send(userData);
        }
    });
}

async function getUser(req, resp) {
    const {id} = req.params;
    
    try {
        const response_user = await User.findById(id).select(["-password"]);
        if (!response_user) {
            resp.status(400).send({msg: "No se han encontrado el usuario."});
        } else {
            resp.status(200).send(response_user);
        }
    } catch (error) {
        resp.status(500).send({msg: "Error del servidor."});        
    }
}

async function getUsers(req, resp) {
    const {user_id} = req.user;
    const response_users = await User.find( { _id: { $ne: user_id }} ).select(["-password"]);
    
    try {
        if (!response_users) {
            resp.status(400).send({msg: "No se han encontrado usuarios."});
        } else {
            resp.status(200).send(response_users);
        }
    } catch (error) {
        resp.status(500).send({msg: "Error del servidor."});        
    }
}

async function getUsersNonGroup (req, resp) {
    const { group_id} = req.params;

    const group = await Group.findById(group_id);
    const participantsStrings = group.participants.toString();

    const participants = participantsStrings.split(",");

    const response = await User.find({ _id: { $nin: participants }}).select(["-password"]);

    if (!response) {
        resp.status(400).send({msg: "No se ha encontrado ningún usuario"});
    } else {
        resp.status(200).send(response);
    }
}

export const UserController = {
    getMe,
    updateUserMe,
    getUser,
    getUsers,
    getUsersNonGroup
};