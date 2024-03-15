const mongoose=require('mongoose');
const {Schema}=mongoose;

const orderItemSchema=new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    size:{
        type: String,
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
        default: 1
    },
    price:{
        type: Number,
        required: true,
    },
    discountedPrice:{
        type: Number,
        required: true,
        default: 0
    },
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
})

const orderItem=mongoose.model('orderItems',orderItemSchema);
module.exports=orderItem