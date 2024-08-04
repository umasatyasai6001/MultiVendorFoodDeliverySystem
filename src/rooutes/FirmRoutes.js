const express=require('express');
const {verifyToken}=require('../middlewares/VerifyToken');
const {FirmRegister}=require('../controllers/FirmController');
const firmRouter=express.Router();


firmRouter.post('/add-firm', verifyToken, FirmRegister);

firmRouter.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.header('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

module.exports={
    firmRouter
}
