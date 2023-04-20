import { jwt } from "../utils/index.js";


function asureAuth(req, resp, next) {
    if(!req.headers.authorization) {
        resp.status(403).send({msg: "Petición no válida. Sin cabecera de autenticación"});
    }


    const token = req.headers.authorization.replace("Bearer ","");

    try {
        const hasExpired = jwt.hasExpiredToken(token);

        if (hasExpired){
            return resp.status(400).send({msg: "Token inválido"});    
        }

        const payload = jwt.decodeToken(token);
        req.user = payload;

        next();

    } catch (error) {
        return resp.status(400).send({msg: "Token inválido"});    
    }
}

export const mwAuth = {
    asureAuth,
}
