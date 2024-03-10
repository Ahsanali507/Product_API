const express=require('express');
const router=express.Router();
const products=require('../models/Product');
const {body, validationResult}=require('express-validator');
const fetchuser=require('../middleware/auth');

router.get('/getAllProducts',fetchuser, async(req,res)=>{
    try{
        let allProducts=await products.find();
        res.status(200).json(allProducts);
    }catch(errors){
        res.status(404).json({message:"products not found!"});
        console.log(`Error while getting all products: ${error}`);
    }
})

router.post('/addProduct',fetchuser,[
    body('title',"Enter valid title").isLength({min: 1}),
    body('description',"Enter valid description").isLength({min: 4}),
    body('price',"Enter price greater than 0").isLength({min: 1}),
], async(req, res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array(), message:"please check you inputs"});
    }

    try{
        let product=await products.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
        })

        res.json(product);
        console.log("Product added successfully!");
    }catch(error){
        console.log("Product not added!");
        res.json(400).json({message: `Error while adding product: ${error}`});
    }
})

router.get('/getSpecificProduct/:id',fetchuser, async(req,res)=>{
    const productID=req.params.id;
    try{
        const product=await products.findOne({_id:productID})
        if(product){
            res.status(200).json(product);
        }
        else{
            res.status(404).json({message: `Product with ID: ${productID} is not found!`});
        }
    }catch(error){
        console.log("This product is not found!");
        res.json({message: `Error while getting this product: ${error}`})
    }
})

router.put('/updateSpecificProduct/:id',fetchuser, async(req,res)=>{
    const productID=req.params.id;
    try{
        const updatedProduct=await products.findOneAndUpdate({_id:productID},req.body,{new: true});
        res.status(200).json(updatedProduct);
    }catch(error){
        console.log("This product is not updated!");
        res.json({message: `Error while updating this product: ${error}`})
    }
})

router.delete('/deleteSpecificProduct/:id',fetchuser, async(req,res)=>{
    const productID=req.params.id;
    try{
        const deletedProduct=await products.findOneAndDelete({_id:productID});
        res.status(200).json(deletedProduct);
    }catch(error){
        console.log("This product is not deleted!");
        res.json({message: `Error while deleting this product: ${error}`})
    }
})

module.exports=router;