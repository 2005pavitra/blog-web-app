import jwt from "jsonwebtoken"

const createTokenandSaveCookies = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.API_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side access
    secure: process.env.NODE_ENV === "production", // Secure only in production
    sameSite: "None", // Ensure proper cross-site behavior
  });

  return token;
};


export default createTokenandSaveCookies;