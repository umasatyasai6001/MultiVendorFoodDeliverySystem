const express = require("express");
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const { router } = require('./rooutes/VendorRouter');
const {ProductRouter}=require('./rooutes/ProductRoutes');
const bodyParser = require('body-parser');
const { firmRouter } = require('./rooutes/FirmRoutes');
const cors = require('cors');
const path = require('path');
const {Vendor}=require('../src/models/Vendor');
const {Firm}=require('../src/models/Firm');
const {Product}=require('../src/models/Product');

dotEnv.config(); // Ensure environment variables are configured first

const app = express();
const PORT = process.env.PORT || 4007;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/uploads', express.static('uploads'));

// Routes
app.use('/vendor', router);
app.use('/firm', firmRouter);
app.use('/product', ProductRouter);
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
async function runDb() {
    try {
        await mongoose.connect(process.env.Mongo_Uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process if the database connection fails
    }
}
runDb();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.get('/vendor/all-vendors', async (req,res)=>{    //getting all vendors
    try{ 
        const vendors=await Vendor.find({}).populate('firm');
        res.send(vendors,);

    }
    catch(err)
    {
        console.error(err);
        res.status(500).send('server error');

    }
})
 app.get('/vendor/single-vendor/:id', async (req,res)=>{
    try{
        const vendor=await Vendor.findById(req.params.id).populate('firm');
        // vendor.populate('firm');
        if(!vendor) return res.status(404).send('vendor not found');
        const query={"name":vendor.name,vendor};
        res.send(query);
    }
    catch(err)
    {
        console.error(err);
        res.status(500).send('server error');
    }
 })
 app.get('/product/:firmId/products', async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) return res.status(404).send('Firm not found');
        console.log(firm, "firmdata");

        // Find all products that have their IDs in the firm's products array
        const products = await Product.find({
            _id: { $in: firm.products }
        })  // Populate if products field references another collection

        res.send(products);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});

    app.delete('/product/:productId', async (req, res) => {
        try {
            const productId = req.params.productId;
            const product = await Product.findByIdAndDelete(productId);
            if (!product) return res.status(404).send('Product not found');
            res.send(product);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    });
    
    




// Start the server
app.listen(PORT, () => {
    console.log(`Server started and running at ${PORT}`);
});







