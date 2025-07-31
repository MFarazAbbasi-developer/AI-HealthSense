import doctorModel from "../models/doctor.js";
import userModel from "../models/user.js";
import adminModel from "../models/admin.js";

export const getUserData = async (req, res) => {
    try {
        const {userId, role} = req.body;

        let user;
        if (role === 'patient') {
            user = await userModel.findById(userId);
        }
        else if (role === 'doctor') {
            user = await doctorModel.findById(userId);
        }
        else if (role === 'admin') {
            user = await adminModel.findById(userId);
        }
        
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        res.json({
            success: true,
            userData: {
                name: user.name.firstName + " " + user.name.lastName,
                isAccountVerified: user.isAccountVerified,
                role,
                // For doctor review andd other
                userId
            }
        });


    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}