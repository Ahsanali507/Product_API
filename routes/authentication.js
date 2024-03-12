const express=require('express');
const users=require('../models/Users');
const router=express.Router();
const {body,validationResult}=require('express-validator');
const dotenv=require('dotenv');
dotenv.config();
const JWT_SECRET=process.env.SECRET_KEY;
const jwt=require('jsonwebtoken');
const fetchuser = require('../middleware/auth');
const nodemailer=require('nodemailer');

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

router.post('/loginuser',[
    body('email',"Enter a valid email ID").isEmail(),
    body('password',"Enter minimum 8 characters password").isLength({min:8}),
], async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors: errors.array()})
    }
    const {email, password}=req.body;
    try {
        const user=await users.findOne({email: email});
        const username=user.username;
        const userPassword=user.password;
        if(!user){
            res.status(404).json({message: "User with this account not found!"});
        }

        if(password!==userPassword){
            res.status(404).json({message: "Invalid email or password!"});
        }

        const data={
            user:{
                userid: user.userid
            }
        }

        const token=jwt.sign(data, JWT_SECRET);
        res.status(200).json({message: "User loggin successfully",username, token});
    } catch (error) {
        console.log("Error occurs");
        res.status(500).json({message: "User not logged in!"});
    }
})

router.post('/getSpecificUser',fetchuser,async(req,res)=>{
    const {uID}=req.body.id;
    try{
        const user=await users.findById(uID).select('-password');
        res.status(200).json(user);
    }catch(error){
        console.log("User not found!");
        res.status(404).json({message: "This user is not found!"});
    }
})

// forgot password
router.post('/forgotpassword',[
    body('email',"Enter valid email").isEmail(),
], async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()});
    }
    const email=req.body.email;
    const otp= Math.floor(100000 + Math.random() * 900000).toString();
    try {
        // const user=await users.findOneAndUpdate(
        //     {email},
        //     {otp, otpExpiration: Date.now() + 600000},
        //     {upsert: true, new: true}
        // )

        const user=await users.findOne({email});
        if(!user){
            console.log("User not found!");
            res.status(404).json({message: "User not found!"});
        }

        user.otp=otp;
        user.otpExpiration=Date.now() + 600000;
        await user.save();

        const transporter=nodemailer.createTransport({
            service: 'Gmail',
            auth:{
                user: 'ahsanzjt@gmail.com',
                pass: 'nnlv ikfr hchy qhf',
            },
        })

        const mailOptions={
            from: 'ahsanzjt@gmail.com',
            to: email,
            subject: 'Password reset OTP',
            text: `Your OTP (It expires in 10 minutes): ${otp}`,
        }

        transporter.sendMail(mailOptions,(error, info)=>{
            if(error){
                res.status(400).json({message: "OTP not sent!"});
                console.log("OTP not sent!");
            }else{
                res.status(200).json({message: "OTP sent to you email please check!", otp});
            }
        })

        // res.status(200).json({message: "User found! and OTP sent!"});
    } catch (error) {
        console.log("Error occurs");
        res.status(500).json({message: "Internal error occurs!"});
    }
})

router.post('/resetpassword',async(req,res)=>{
    const {email, otp, newpassword, confirmpassword}=req.body;
    if(newpassword!==confirmpassword){
        res.json({message: "Password and confirm password not matched!"});
    }
    try{
        const user=await users.findOne({email,otp});
        if(!user || user.otpExpiration< Date.now()){
            console.log('Invalid email or OTP');
            res.status(400).json({message: "Invalid email or OTP"});
        }else{
            // console.log(user);
            user.otp=undefined;
            user.otpExpiration=undefined;
            user.password=newpassword;
            await user.save();
            res.status(200).json({message: "Password reset successfully!"});
        }
    }catch(error){
        console.log("Password not reset!");
        res.status(500).json({message: "Password not reset!"});
    }
})

// update particular user by admin route

// delete particular user by admin route

// login admin route


module.exports=router