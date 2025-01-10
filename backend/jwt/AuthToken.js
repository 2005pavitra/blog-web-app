import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';

const createTokenandSaveCookies = async(userId, res) =>{
    const token = jwt.sign({userId}, process.env.SECRET_KEY, {
        expiresIn: "7d"
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure:true,
        satisfies:"strict",
    });
    User.token = token;
    await User.findByIdAndUpdate(userId, {token});
    return token;
}

export default createTokenandSaveCookies;