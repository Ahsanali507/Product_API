const mongoose=require('mongoose');
const {Schema}=mongoose;

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,Number,
        required:true
    },
    mobile:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        default:"CUSTOMER"
    },
    address:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"addresses"
        }
    ],
    paymentInformation:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"paymentInformations"
        }
    ],
    ratings:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"ratings"
        }
    ],
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"reviews"
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now()
    },
    otp:{
        type: String,
        required: false
    },
    otpExpiration:{
        type: Date,
        required: false
    }
})

const users=mongoose.model('users',UserSchema);
//users.createIndexes();
module.exports=users