const mongoose=require('mongoose');

const vendorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    firm:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm'
    }]

})
// module.exports=mongoose.model('Vendor',vendorSchema);
const Vendor=mongoose.model('Vendor',vendorSchema);
module.exports={
    Vendor
};
