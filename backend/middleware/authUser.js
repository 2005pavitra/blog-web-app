import { User } from "../models/user.models.js"
import jwt from "jsonwebtoken"

//Authentication


export const isAuthenticated = async (req, res, next) => {
    try {
        const token = await req.cookies.token;

        // console.log("Middleware: ",token)

        if (!token) {
            return res.status(401).json({ error: "Not token provided" })
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: "User not Found" })
        }
        req.user = user;
        console.log(req.user.role)
        next()
    } catch (error) {
        console.log("Error in Authentication: ", error);
        return res.status(401).json({ error: "User not authenticated" })
    }

}



//Check Admin Role
export const isAdmin = (req, res, next) => {

    if (req.user?.role !== "admin") {
        return res.status(401).json({ error: "Access denied. Admins only." })
    }
    next();
}