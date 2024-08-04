const {Firm}=require('../models/Firm');
const {Vendor}=require('../models/Vendor');
const multer = require('multer');
const path = require('path');
const { imageUpload } = require('./ProductController');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
    }
});
const upload = multer({ storage: storage });



const FirmRegister=async (req,res)=>{
    try{
   const { firmName, area, category, region, offer } = req.body;
   const image = req.file ? req.file.filename : undefined;
   const vendor=await Vendor.findById(req.vendorId);
   console.log(vendor,"vendordata");
   if(!vendor)
   {
    return res.status(404).json({message:'vendor not found'});
    
   }
   if (vendor.firm.length > 0) {
    return res.status(400).json({ message: "vendor can have only one firm" });
}

    const firm=new Firm({
        firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor:[vendor._id]
    })
    await firm.save();
    const firmId=firm._id;
    const vendorFirmName=firm.firstName;
    vendor.firm.push(firm._id);
    await vendor.save();

    return res.status(200).json({ message: 'Firm Added successfully ', firmId, vendorFirmName })

    }
    catch (error) {
        console.error(error)
        res.status(500).json("intenal server error")
    }

    const imageUpload=upload.single('image');

}
module.exports={
    // FirmRegister:[upload.single('image'),FirmRegister]
    FirmRegister,
    imageUpload
}