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
    },
    discountedPrice:{
        type: Number,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    color:{
        type: String,
        required: true
    },
    sizes:[{
        name: {type: String},
        quantity: {type: Number}
    }],
    imageURL:{
        type: String
    },
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
    numRatings:{
        type: Number,
        default: 0
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

const Product= mongoose.model('Product', productSchema);
module.exports=Product;