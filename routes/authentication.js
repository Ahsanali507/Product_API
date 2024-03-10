const express=require('express');
const users=require('../models/Users');
const router=express.Router();
const {body,validationResult}=require('express-validator');
const dotenv=require('dotenv');
dotenv.config();
const JWT_SECRET=process.env.SECRET_KEY;
const jwt=require('jsonwebtoken');

router.post('/',[
    //create user
    body('userid','please enter valid userid').isLength({min:1}),
    body('username','please enter valid username').isLength({min:3}),
    body('email','please enter valid email').isEmail(),
    body('password','password must atleast 5 characters').isLength({min:5}),
], async(req,res)=>{
    //check if errors occur then return status and those errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        //check user with same email already exists or not
        let user=await users.findOne({email:req.body.email})
        if(user){
            return res.status(400).json({error:"User already exist with this email"});
        }
        user=await users.create({
            userid:req.body.userid,
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
        })

        const data={
            user:{
              userid:user.userid
            }
        }

        const authenToken=jwt.sign(data,JWT_SECRET);
        res.json({user, authenToken});
        console.log("user added with new email");
        // res.json(user);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send({error:"some error occured"});
    }
})

module.exports=router