const {Product}=require('../models/Product');
const {Firm}=require('../models/Firm');
const multer=require('multer');
const path=require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
    }
});
const upload = multer({ storage: storage });




const addProduct= async (req,res)=>{
    try{
        const {productName, productPrice, category, bestSeller, description}=req.body;
        const image = req.file ? req.file.filename : undefined;
        const firmId=req.params.firmId;
        const firm=await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }
        const product = new Product({
            productName,
            productPrice,
            category,
            bestSeller,
            description,
            image,
            firm: firm._id
        })
        await product.save();
        res.status(202).json({"message":"product added"});

        firm.products.push(product._id);
        await firm.save();

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
}
const imageUpload=upload.single('image');


module.exports={
    addProduct,
    imageUpload
}