const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const {body, validationResult}=require('express-validator');
const fetchuser=require('../middleware/auth');
const AppError=require('../utils/error');
const Carts=require('../models/Cart');
const CartItems=require('../models/CartItem');
const Product=require('../models/Product');

router.get('/getusercart/:id',fetchuser,async(req,res,next)=>{
    const userID=req.params.id;
    try{
        const isValidObjectId=mongoose.Types.ObjectId.isValid(userID);
        if (!isValidObjectId) {
            // If the provided ID is not a valid ObjectId, handle the error accordingly.
            return next(new AppError(`Invalid user ID: ${userID}`, 400));
        }
        const uID=mongoose.Types.ObjectId(userID);
        const cart=await Carts.findOne({user:uID});
        const cartItems=await CartItems.find({cart:cart._id}).populate("product");

        cart.cartItems=cartItems;

        let totalPrice=0;
        let totalDiscountedPrice=0;
        let totalItems=0;

        for(let cartItem of cartItems){
            cartItem.totalPrice+=totalPrice;
            cartItem.totalDiscountedPrice+=totalDiscountedPrice;
            cartItem.totalItems+=totalItems;
        }

        cart.totalPrice=totalPrice;
        cart.totalItems=totalItems;
        cart.totalDiscountedPrice=totalDiscountedPrice;

        res.status(200).json({message: 'Here is your cart', cart});
    }catch(error){
        console.log("Error while getuserCart!");
        next(error);
    }
})

router.post('/addcartitem',fetchuser,async(req,res,next)=>{
    const userID=req.body.userid;
    const productID=req.body.productID;
    try {
        const isValidObjectId=mongoose.Types.ObjectId.isValid(userID);
        if (!isValidObjectId) {
            // If the provided ID is not a valid ObjectId, handle the error accordingly.
            return next(new AppError(`Invalid user ID: ${userID}`, 400));
        }
        const uID=mongoose.Types.ObjectId(userID);
        const pID=mongoose.Types.ObjectId(productID);
        const cart=await Carts.findOne({user:uID});
        const product=await Product.findById(pID);
        // console.log(pID);

        const isPresent= await CartItems.findOne({cart: cart._id, product: product._id, uID});
        if(!isPresent){
            const cartItem=new CartItems({
                product: product._id,
                cart: cart._id,
                quantity: 1,
                uID,
                price: product.price,
                size: req.size,
                discountedPrice: product.discountedPrice,
            })

            const createdCartItem= await cartItem.save();
            cart.cartItems.push(createdCartItem);
            await cart.save();

            res.status(200).json({message: "cartItem added to cart", createdCartItem})
        }
        else{
            console.log("Cartitem already exists of this product!");
            return next(new AppError(`Cartitem already exists of this product!`, 400));
        }
    } catch (error) {
        // next(error);
        return next(new AppError(`Invalid user ID: ${userID}, and cartitem not added!`, 400));
    }
})

// update cartItem
router.put('/updatecartitem/:id',fetchuser,async(req, res, next)=>{
    const cartItemID=req.params.id;
    const {userID, productID} = req.body;
    try {
        
    } catch (error) {
        next(error);
    }
})

// delete cartItem

// find cartItem by ID

module.exports=router;