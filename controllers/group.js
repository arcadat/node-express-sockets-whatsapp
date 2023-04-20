import { User, Group, GroupMessage } from "../models/index.js";
import { getFilePath } from "../utils/index.js"; 

// Funtions

function createGroup (req, resp) {
    const group = new Group (req.body);
    const { user_id } = req.user;

    group.creator = user_id;
    group.participants = JSON.parse(req.body.participants);
    group.participants = [...group.participants, user_id];

    if (req.files.image) {
        const imagePath = getFilePath (req.files.image);
        group.image = imagePath;
    }

    group.save( (error, groupStorage) => {
        if (error) {
            resp.status(500).send({msg: "Error del servidor"});
        } else {
            if (!groupStorage) {
                resp.status(400).send({msg: "Error al crear el grupo"});
            } else {
                resp.status(201).send(groupStorage);
            }
        }
    });
};

function getMyGroups (req, resp) {
    const {user_id} = req.user;

    Group.find({ participants: user_id })
    .populate("creator")
    .populate("participants")
    .exec(async (error, groups) => {
        if (error) {
            resp.status(500).send({msg: "Error al obtener los grupos" });
        } else {

            // Obtener fecha del ultimo mensaje de cada grupo...

            const arrayGroups = [];
            for await (const group of groups) {
                const response = await GroupMessage.findOne({group: group._id}).sort({
                    createdAt: -1
                });

                arrayGroups.push({
                    ...group._doc,
                    last_message_date: response?.createdAt || null
                });
            }

            resp.status(200).send(arrayGroups);
        }
    })
}

function getGroup (req, resp) {
    const group_id = req.params.id;

    Group.findById(group_id, (error, groupStorage) => {
        if (error) { 
            resp.status(400).send({msg: "Error del servidor."});
        } else if (!groupStorage)  {
            resp.status(400).send({msg: "No se ha encontrado el grupo."});
        } else {
            resp.status(200).send(groupStorage);
        }

    })
    .populate("participants")
}

async function updateGroup (req, resp) {
    const { id } = req.params;
    const { name } = req.body;

    const group = await Group.findById(id);

    if (name) group.name = name;

    if (req.files.image) {
        const imagePath = getFilePath(req.files.image);

        group.image = imagePath;
    }

    Group.findByIdAndUpdate (id, group, (error) => {
        if (error) {
            resp.status(500).send({msg: "Error del servidor"});            
        } else {
            resp.status(200).send({image: group.image, name: group.name});
        }
    })

}

async function exitGroup (req, resp) {

    const { id } = req.params;
    const { user_id } = req.user;

    const group = await Group.findById(id);

    const newParticipants = group.participants.filter((participant) => {
        participant.toString() !== user_id
    });

    const newData = {
        ...group._doc, 
        participants: newParticipants
    }

    await Group.findByIdAndUpdate(id, newData);

    resp.status(200).send ({msg: "Salida éxitosa"});
}

async function addParticipants (req, resp) {
    const { id } = req.params;
    const { users_id } = req.body;   
    
    const group = await Group.findById(id);
    const users = await User.find({_id: users_id});

    const arrayObjectIds = [];

    users.forEach( (user) => {
        arrayObjectIds.push(user.id);        
    });

    const newData = {
        ...group._doc, 
        participants: [...group.participants, ...arrayObjectIds]
    }    

    await Group.findByIdAndUpdate(id, newData);

    resp.status(200).send({msg: "Participantes añadidos correctamente"});

}


async function banParticipant (req, resp) {

    const { group_id, user_id } = req.body;
    const group = await Group.findById(group_id);

    const newParticipants = group.participants.filter((participant) =>
        participant.toString() !== user_id
    );

    const newData = {
        ...group._doc, 
        participants: newParticipants
    }

    await Group.findByIdAndUpdate(group_id, newData);

    resp.status(200).send ({msg: "Baneo realizado con éxito"});    


}

export const GroupsController = {
    // Export Functions
    createGroup,
    getMyGroups,
    getGroup,
    updateGroup,
    exitGroup,
    addParticipants,
    banParticipant
};