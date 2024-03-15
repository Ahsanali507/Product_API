const mongoose=require('mongoose');
const {Schema}=mongoose;

const reviewSchema=new mongoose.Schema({
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
    review:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

const review= mongoose.model('reviews', reviewSchema);
module.exports=review;