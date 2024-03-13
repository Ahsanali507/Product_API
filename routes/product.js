const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
const products=require('../models/Product');
const {body, validationResult}=require('express-validator');
const fetchuser=require('../middleware/auth');
const AppError=require('../utils/error');

router.get('/getAllProducts',fetchuser, async(req,res, next)=>{
    try{
        let allProducts=await products.find();
        res.status(200).json(allProducts);
    }catch(errors){
        console.log(`Error while getting all products: ${error}`);
        // res.status(404).json({message:"products not found!"});
        return next(new AppError('Products not found!',404));

    }
})

router.post('/addProduct',fetchuser,[
    body('title',"Enter valid title").isLength({min: 1}),
    body('description',"Enter valid description").isLength({min: 4}),
    body('price',"Enter price greater than 0").isLength({min: 1}),
], async(req, res, next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        // return res.status(400).json({errors: errors.array(), message:"please check you inputs"});
        return next(new AppError('Please enter valid input details',400));
    }

    try{
        let product=await products.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
        })

        const savedProduct=await product.save();
        res.json(savedProduct);
        console.log("Product added successfully!");
    }catch(error){
        console.log("Product not added!");
        // res.json(400).json({message: `Error while adding product: ${error}`});
        return next(new AppError(`Error while adding product: ${error}`,400));
    }
})

router.get('/getSpecificProduct/:id',fetchuser, async(req,res, next)=>{
    const productID=req.params.id;
    try{
        const isValidObjectId = mongoose.Types.ObjectId.isValid(productID);

        if (!isValidObjectId) {
        // If the provided ID is not a valid ObjectId, handle the error accordingly.
            return next(new AppError(`Invalid product ID: ${productID}`, 400));
        }

        const product = await products.findOne({ _id: mongoose.Types.ObjectId(productID) });
        if(product){
            res.status(200).json(product);
        }
        else{
            // res.status(404).json({message: `Product with ID: ${productID} is not found!`});
            return next(new AppError(`Product with ID: ${productID} is not found!`,404));
        }
    }catch(error){
        console.log("Internal error!",productID);
        // res.json({message: `Error while getting this product: ${error}`})
        return next(new AppError(`Error while getting this product: ${error}`,500));
    }
})

router.put('/updateSpecificProduct/:id',fetchuser, async(req,res, next)=>{
    const productID=req.params.id;
    try{
        const isValidObjectId = mongoose.Types.ObjectId.isValid(productID);

        if (!isValidObjectId) {
        // If the provided ID is not a valid ObjectId, handle the error accordingly.
            return next(new AppError(`Invalid product ID: ${productID}`, 400));
        }
        const updatedProduct=await products.findOneAndUpdate({_id: mongoose.Types.ObjectId(productID)},req.body,{new: true});
        res.status(200).json(updatedProduct);
    }catch(error){
        console.log("This product is not updated!");
        // res.json({message: `Error while updating this product: ${error}`})
        return next(new AppError(`Error while updating this product: ${error}`,400));
    }
})

router.delete('/deleteSpecificProduct/:id',fetchuser, async(req,res,next)=>{
    const productID=req.params.id;
    try{
        const isValidObjectId = mongoose.Types.ObjectId.isValid(productID);

        if (!isValidObjectId) {
        // If the provided ID is not a valid ObjectId, handle the error accordingly.
            return next(new AppError(`Invalid product ID: ${productID}`, 400));
        }
        const deletedProduct=await products.findOneAndDelete({_id:mongoose.Types.ObjectId(productID)});
        if(!deletedProduct){
            return next(new AppError('Product is not found!',404));
        }
        else{
            res.status(200).json(deletedProduct);
        }
    }catch(error){
        console.log("This product is not deleted!");
        // res.json({message: `Error while deleting this product: ${error}`})
        return next(new AppError(`Error while deleting this product: ${error}`,500));
    }
})

module.exports=router;