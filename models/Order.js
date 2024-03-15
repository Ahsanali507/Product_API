const mongoose=require('mongoose');
const {Schema}=mongoose;

const orderSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    orderItems:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'orderItems'
    },
    orderDate:{
        type:Date,
        required:true,
        default: Date.now()
    },
    deliveryDate:{
        type: Date
    },
    shippingAddress:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addresses'
    },
    paymentDetails:{
        paymentMethod:{
            type: string
        },
        transactionID:{
            type: String
        },
        paymentID:{
            type: String
        },
        paymentStatus:{
            type: String,
            default:'PENDING'
        }
    },
    totalPrice:{
        type: Number,
        required: true
    },
    totalDiscountedPrice:{
        type: Number,
        required: true
    },
    discount:{
        type: Number,
        required: true
    },
    orderSatus:{
        type: String,
        required: true,
        default: 'PENDING'
    },
    totalItems:{
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

const order=mongoose.model('orders',orderSchema);
module.exports=order