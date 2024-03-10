const mongoose=require('mongoose');
const {Schema}=mongoose;

const UserSchema=new mongoose.Schema({
    userid:{
        type:Number,
        required:true,
        unique:true
    },
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
    }
})

const users=mongoose.model('users',UserSchema);
//users.createIndexes();
module.exports=users