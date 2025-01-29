
const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {generateToken}=require('../Utilities/generateToken');


// sign up api
exports.signup = async(req, res)=>{
    const {firstName, lastName, email, password}=req.body;

    try{

        if(!firstName){
            return res
            .status(400)
            .json({error:true, message:"First Name is required"});
        }

        if(!lastName){
            return res
            .status(400)
            .json({error:true, message:"Last Name is required"});
        }
        if(!email){
            return res
            .status(400)
            .json({error:true, message:"Email is required"});
        }
        if(!password){
            return res
            .status(400)
            .json({error:true, message:"Password is required"});
        }

        const isUser= await User.findOne({email:email});
        if(isUser){
            return res
            .status(400)
            .json({
                error:true,
                message:"User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user= await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
        });

        const token=generateToken(user._id)

         res.status(200).json({
            error:false,
            message:"User Created successful",
            _id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            token,
        });
    }

    catch(error){
        console.log("Error during signup:", error);
        res.status(500).json({
            error:true,
            message:"Internal Server Error",
        });
    }
};

// login api

 exports.login= async(req, res)=>{
    const {email, password}=req.body;
    
    try{

        if(!email){
            return res
            .status(400)
            .json({error:true, message:"Please enter your email"});
        }

        if(!password){
            return res
            .status(400)
            .json({error:true, message:"Please enter your password"});
        }

        const user= await User.findOne({email})
        if(!user){
            return res
            .status(400)
            .json({error:true, message:"User not found. Please sign up"});
        }
        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res
            .status(400)
            .json({error:true, message:"Invalid Password"});

        }
        const token=generateToken(user._id);

        res 
        .status(200)
        .json({error: false,
            message: "User logged in successfully",
            _id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            token,
        });

    }
    catch(error){
            res
            .status(500)
            .json({error:true,
                message:"Internal Server Error",
            });
    }
 };
  // get account api
 exports.getAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id); 
        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }
        res.status(200).json({
            error: false,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }
        });
    } catch (error) {
        console.error("Error fetching user account:", error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// update account api
exports.updateUserDetails = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;

        const updates = {};
        if (firstName) updates.firstName = firstName;
        if (lastName) updates.lastName = lastName;
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
            if (existingUser) {
                return res.status(400).json({
                    error: true,
                    message: "Email already in use by another account.",
                });
            }
            updates.email = email;
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found",
            });
        }

        res.status(200).json({
            error: false,
            message: "Profile updated successfully.",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                fullName: `${user.firstName} ${user.lastName}`,
            },
        });
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};


