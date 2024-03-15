const mongoose=require('mongoose');
const {Schema}=mongoose;

const ratingSchema=new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        unique: true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating:{
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

const rating= mongoose.model('ratings', ratingSchema);
module.exports=rating;