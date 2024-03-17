const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const {body, validationResult}=require('express-validator');
const fetchuser=require('../middleware/auth');
const AppError=require('../utils/error');
const Carts=require('../models/Cart');
const CartItems=require('../models/CartItem');

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

module.exports=router;