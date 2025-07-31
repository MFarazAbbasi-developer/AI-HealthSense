import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.json({ success: false, message: "Not Authorized.1. Login again." });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken.id) {
            req.body.userId = decodedToken.id;
            req.body.role = decodedToken.role;
        }else{
            return res.json({ success: false, message: "Not Authorized.2. Login again." });
        }

        next();


    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export default userAuth;