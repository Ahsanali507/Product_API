const mongoose=require('mongoose');
const {Schema}=mongoose;

const cartItemSchema=new mongoose.Schema({
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        required: true,
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Product',
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
    discount:{
        type: Number,
        required: true,
        default: 0
    },
    discountedPrice:{
        type: Number,
        required: true,
    },
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    }
})

const CartItems=mongoose.model('cartItems',cartItemSchema);
module.exports=CartItems;