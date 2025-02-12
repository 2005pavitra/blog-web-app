import jwt from "jsonwebtoken";

const createTokenandSaveCookies = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true, 
    secure: false,  
    sameSite: "Lax", 
  });

  return token;
};

export default createTokenandSaveCookies;
