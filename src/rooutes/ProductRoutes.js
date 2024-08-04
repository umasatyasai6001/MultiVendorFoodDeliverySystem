const {addProduct}=require('../controllers/ProductController');
const express=require('express');
const ProductRouter=express.Router();
ProductRouter.post('/add-product/:firmId',addProduct);

ProductRouter.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.header('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});



module.exports={
    ProductRouter
}