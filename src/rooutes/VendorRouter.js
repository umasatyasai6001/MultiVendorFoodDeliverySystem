const {VendorRegister,VendorLogin} = require('../controllers/VendorController');
const express = require('express');

const router = express.Router();

router.post('/register', VendorRegister);
console.log(VendorRegister,"userdata");
router.post('/login',VendorLogin);

module.exports = {
    router
};

