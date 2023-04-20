import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import { jwt } from "../utils/index.js";


function register (req, resp) {
    const {email, password} = req.body;

    const user = new User ({
        email: email.toLowerCase(),
        password: password
    });

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    user.password = hashPassword;

    user.save((error, userStorage) => {
        if (error) {
            console.log(error);
            resp.status(400).send({msg: "Error al registrar usuario"})
        } else {
            resp.status(201).send({userStorage})
        }
    });
};


function login (req, resp) {
    const {email, password} = req.body;

    const emailLowerCase = email.toLowerCase();

    User.findOne({email: emailLowerCase}, (error, userStorage) => {
        if (error) {
            resp.status(500).send({msg: "Registro no encontrado"});
        } else {
            bcrypt.compare(password, userStorage.password, (bcryptError, check) => {
                if (bcryptError) {
                    resp.status(500).send( {msg: "Error del servidor"} );
                } else if (!check) {
                    resp.status(400).send( {msg: "Contraseña incorrecta"} );
                } else {
                    resp.status(200).send({
                        access: jwt.createAccessToken(userStorage),
                        refresh: jwt.createRefreshToken(userStorage),

                    });

                }

            });
        }

    });
}

function refreshToken (req, resp) {
    const {refreshToken} = req.body;

    if (!refreshToken) {
        req.status(400).send( {msg: "Token requerido"});
    }

    const hasExpired = jwt.hasExpiredToken(refreshToken);
    if (hasExpired) {
        resp.status(400).send({msg: "Token expirado"});
    }

    const { user_id } = jwt.decodeToken(refreshToken);

    User.findById( user_id, (error, userStorage) => {
        if (error) {
            resp.status(500).send({msg: "Error del servidor"});
        } else {
            resp.status(200).send({
                accessToken: jwt.createAccessToken(userStorage)
            });
        }
    });
}


export const AuthController = {
    register,
    login, 
    refreshToken
};