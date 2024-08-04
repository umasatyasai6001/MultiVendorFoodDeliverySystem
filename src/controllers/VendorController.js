const {Vendor} = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');

dotEnv.config();

// const secretKey = process.env.WhatIsYourName



const VendorRegister = async(req, res) => {
    const { name, email, password } = req.body;
    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json("Email already taken");
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new Vendor({
            name,
            email,
            password: hashedPassword
        });
        await newVendor.save();

        res.status(201).json({ message: "Vendor registered successfully" });
        console.log('registered')

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }

}

const VendorLogin = async(req,res)=>{
    const {email,password}=req.body;
    const validUser=await Vendor.findOne({email});
    console.log(validUser,"validuser");
    if(validUser){
       const ismatch= await bcrypt.compare(password,validUser.password)
       if(ismatch){
        const token=jwt.sign({_id:validUser._id},process.env.JwtSecret ,{expiresIn: '24h'})
        const vendorId=validUser._id;
        res.json({token})
        res.send({message:"logged in successfully"});
       }else{
        res.status(400).json({message:"Invalid credientials"})


       }

    }

    }



module.exports={
    VendorRegister,
    VendorLogin
}
