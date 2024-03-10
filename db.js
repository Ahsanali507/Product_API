const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
const mongoUrl=process.env.MONGO_Url;

const connectToMongo=()=>{
    mongoose.connect(mongoUrl,()=>{
        console.log("connect to mongoose successfully");
    })
    
}

module.exports=connectToMongo