import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constans.js";


function createAccessToken (user) {
    const expireToken = new Date();
    expireToken.setHours(expireToken.getHours() + 24);

    const payload = {
        token_type: "access",
        user_id: user._id,
        iat: Date.now(),
        exp: expireToken.getTime(),
    };

    return jsonwebtoken.sign(payload, JWT_SECRET_KEY)
};


function createRefreshToken (user) {
    const expireToken = new Date();
    expireToken.setMonth(expireToken.getMonth() + 1);

    const payload = {
        token_type: "refresh",
        user_id: user._id,
        iat: Date.now(),
        exp: expireToken.getTime(),
    };

    return jsonwebtoken.sign(payload, JWT_SECRET_KEY)
};


function decodeToken(token) {
    return jsonwebtoken.decode(token, JWT_SECRET_KEY, true);
}

function hasExpiredToken(token) {
    const { exp } = decodeToken(token);
    const currentDate = Date().getTime;

    if (exp <= currentDate) {
        return true;
    }

    return false;
}

export const jwt = {
    createAccessToken,
    createRefreshToken,
    decodeToken,
    hasExpiredToken
}