const mongoose=require('mongoose');
const {Schema}=mongoose;

const productSchema=new mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
})

const product= mongoose.model('Product', productSchema);
module.exports=product;