const express=require('express');
const connectToMongo=require('./db');
const app=express();
const dotenv=require('dotenv');
dotenv.config();
const port=process.env.PORT || 3001;
const errorHandler=require('./utils/errorHandler');

connectToMongo();

app.use(express.json());

app.use('/api/authentication',require('./routes/authentication'));
app.use('/api', require('./routes/product'));

app.use(errorHandler);

app.listen(port,()=>{
    console.log("server running on port "+port);
})
