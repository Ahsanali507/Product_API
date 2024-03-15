const mongoose=require('mongoose');
const {Schema}=mongoose;

const addressSchema=new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    street:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
})

const addresses=mongoose.model('addresses', addressSchema);
module.exports=addresses;