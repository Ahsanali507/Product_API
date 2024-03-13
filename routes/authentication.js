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
const AppError=require('../utils/error');
const mongoose=require('mongoose');

router.post('/',[
    //create user
    body('userid','please enter valid userid').isLength({min:1}),
    body('username','please enter valid username').isLength({min:3}),
    body('email','please enter valid email').isEmail(),
    body('password','password must atleast 8 characters').isLength({min:8}),
], async(req,res, next)=>{
    //check if errors occur then return status and those errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        // return res.status(400).json({errors:errors.array()})
        return next(new AppError('Please enter valid details',400));
    }

    try{
        //check user with same email already exists or not
        let user=await users.findOne({email:req.body.email})
        if(user){
            // return res.status(400).json({error:"User already exist with this email"});
            return next(new AppError('Account already exists!',400));
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
        console.log("Account created successfully!");
        // res.json(user);
    }
    catch(error){
        console.error(error.message);
        // res.status(500).send({error:"some error occured"});
        return next(new AppError('Some internal errors!',500));
    }
})

router.post('/loginuser',[
    body('email',"Enter a valid email ID").isEmail(),
    body('password',"Enter minimum 8 characters password").isLength({min:8}),
], async(req,res, next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        // res.status(400).json({errors: errors.array()})
        return next(new AppError('Please enter valid details',400));
    }
    const {email, password}=req.body;
    try {
        const user=await users.findOne({email: email});
        const username=user.username;
        const userPassword=user.password;
        if(!user){
            // res.status(404).json({message: "User with this account not found!"});
            return next(new AppError('Account not found!',404));
        }

        if(password!==userPassword){
            // res.status(404).json({message: "Invalid email or password!"});
            return next(new AppError('Invalid email or password!',400));
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
        // res.status(500).json({message: "User not logged in!"});
        return next(new AppError('Account not logged In!',500));
    }
})

router.post('/getSpecificUser',fetchuser,async(req,res, next)=>{
    const {uID}=req.body.id;
    try{
        const user=await users.findById(uID).select('-password');
        res.status(200).json(user);
    }catch(error){
        console.log("User not found!");
        // res.status(404).json({message: "This user is not found!"});
        return next(new AppError('User not found!',404));
    }
})

// forgot password
router.post('/forgotpassword',fetchuser,[
    body('email',"Enter valid email").isEmail(),
], async(req,res, next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        // res.status(400).json({errors:errors.array()});
        return next(new AppError('Please enter valid details!',400));
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
            // res.status(404).json({message: "User not found!"});
            return next(new AppError('User not found!',404));
        }

        user.otp=otp;
        user.otpExpiration=Date.now() + 600000;
        await user.save();

        const transporter=nodemailer.createTransport({
            service: 'Gmail',
            auth:{
                user: 'you email',
                pass: 'you app password',
            },
        })

        const mailOptions={
            from: 'sender email id',
            to: email,
            subject: 'Password reset OTP',
            text: `Your OTP (It expires in 10 minutes): ${otp}`,
        }

        transporter.sendMail(mailOptions,(error, info)=>{
            if(error){
                console.log("OTP not sent!");
                // res.status(400).json({message: "OTP not sent!"});
                return next(new AppError('OTP not sent!',400));
            }else{
                res.status(200).json({message: "OTP sent to you email please check!", otp});
            }
        })

        // res.status(200).json({message: "User found! and OTP sent!"});
    } catch (error) {
        console.log("Error occurs");
        // res.status(500).json({message: "Internal error occurs!"});
        return next(new AppError('Internal error OTP not sent!',500));
    }
})

router.post('/resetpassword',fetchuser,[
    body('email','please enter valid email').isEmail(),
],async(req,res, next)=>{
    const {email, otp, newpassword, confirmpassword}=req.body;
    if(newpassword!==confirmpassword){
        // res.json({message: "Password and confirm password not matched!"});
        return next(new AppError('Password and confirm password not matched!',400));
    }
    if(newpassword.length<8){
        return next(new AppError('Please enter password minimum 8 characters!',400));
    }
    try{
        const user=await users.findOne({email,otp});
        if(!user || user.otpExpiration< Date.now()){
            console.log('Invalid or expired OTP');
            user.otp=undefined;
            user.otpExpiration=undefined;
            await user.save();
            // res.status(400).json({message: "Invalid email or OTP"});
            return next(new AppError('Invalid or expired OTP!',400));
        }
        else{
            // console.log(user);
            user.otp=undefined;
            user.otpExpiration=undefined;
            user.password=newpassword;
            await user.save();
            console.log("Password reset successfully");
            res.status(200).json({message: "Password reset successfully!"});
        }
    }catch(error){
        console.log("Password not reset!");
        // res.status(500).json({message: "Password not reset!"});
        return next(new AppError('Internal error password not reset!',500));
    }
})

// update particular user by admin route later on we will create a separate route for admin and put this code into that routre
router.put('/updateuser/:id',fetchuser, async(req,res, next)=>{
    const userID=req.params.id;
    try{
        const isValidObjectId = mongoose.Types.ObjectId.isValid(userID);

        if (!isValidObjectId) {
        // If the provided ID is not a valid ObjectId, handle the error accordingly.
            return next(new AppError(`Invalid user ID: ${userID}`, 400));
        }
        const updatedUser=await users.findOneAndUpdate({_id: mongoose.Types.ObjectId(userID)},req.body,{new: true});
        res.status(200).json(updatedUser);
    }catch(error){
        console.log("This user is not updated!");
        // res.json({message: `Error while updating this user: ${error}`})
        return next(new AppError(`Error while updating this user: ${error}`,500));
    }
})

// delete particular user by admin route later on we will create a separate route for admin and put this code into that routre
router.delete('/deleteuser/:id',fetchuser, async(req,res,next)=>{
    const userID=req.params.id;
    try{
        const isValidObjectId = mongoose.Types.ObjectId.isValid(userID);

        if (!isValidObjectId) {
        // If the provided ID is not a valid ObjectId, handle the error accordingly.
            return next(new AppError(`Invalid user ID: ${userID}`, 400));
        }
        const deletedUser=await users.findOneAndDelete({_id:mongoose.Types.ObjectId(userID)});
        if(!deletedUser){
            return next(new AppError('User not found!',404));
        }
        else{
            console.log("User deleted sy=uccessfully");
            res.status(200).json(deletedUser);
        }
    }catch(error){
        console.log("This user is not deleted!");
        // res.json({message: `Error while deleting this user: ${error}`})
        return next(new AppError(`Error while deleting this user: ${error}`,500));
    }
})

// login admin route

// update user profile by user him/herself

module.exports=router