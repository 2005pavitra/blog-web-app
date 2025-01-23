export const register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
    // console.log(name, email, password, phone, role);    
    if(!name || !email || !password || !phone || !role){
        return res.status(400).json({error: "All fields are required"})
    }

    const user =await User.findOne({email})
    if(user){
        return res.status(400).json({error: "User already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await new User({
        email, name, password:hashedPassword, phone, role
    })
    await newUser.save()
    if(newUser){
        createTokenandSaveCookies(newUser._id, res)
    }
    res.status(201).json({message: "User registered successfully", newUser, token: newUser.token})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal server error"})
    }
}