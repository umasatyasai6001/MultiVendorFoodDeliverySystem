const { Vendor } = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();

const secretKey = process.env.JwtSecret;

const verifyToken = async (req, res, next) => {
    const token = req.headers.token;
    console.log(token,"token received");
    console.log(secretKey,"secretkey");
    
    // if (!authHeader) {
    //     return res.status(401).json({ error: "Authorization header is required" });
    // }

    // const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, secretKey); // Getting the particular vendor data
        console.log(decoded,"decoded");
        const vendor = await Vendor.findById(decoded._id);

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        req.vendorId = vendor._id;
        next();
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    verifyToken
};
