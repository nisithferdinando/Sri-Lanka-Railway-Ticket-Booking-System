const Admin = require('../../models/admin/Admin');
const { generateToken } = require('../../Utilities/generateToken');

exports.adminLogin = async(req, res) => {
    const { adminCode, password } = req.body;
    try {
        const admin = await Admin.findOne({ adminCode });
        if (!admin) {
            return res
                .status(400)
                .json({ error: true, message: "Admin does not exist" });
        }
        
        const isMatch = (password === admin.password);
        
        if (!isMatch) {
            return res
                .status(400)
                .json({ error: true, message: "Invalid Password" });
        }
        
        const token = generateToken(admin._id);
        res
            .status(200)
            .json({
                error: false,
                message: "Admin logged in successfully",
                id: admin._id, 
                adminCode: admin.adminCode,
                token,
            });
    }
    catch (error) {
             res
            .status(500)
            .json({
                error: true,
                message: "Internal Server Error",
            });
    }
};