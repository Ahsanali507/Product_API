const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();
const JWT_SECRET=process.env.SECRET_KEY;

const fetchuser=(req,res,next)=>{
    const token=req.header('authToken');
    //console.log(token);
    if(!token){
        res.status(401).send({error:"Token not found! user can't access first need to login"});
    }
    try {
        const user=jwt.verify(token,JWT_SECRET);
        //console.log(data);
        req.user=user;
        //console.log(req.user);
        next();
    } catch (error) {
        res.status(401).json({error:"Please use a valid token"});
    }
}


module.exports=fetchuser;