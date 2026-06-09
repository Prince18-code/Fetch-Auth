const express = require ('express');
const mongoose = require('mongoose');
const app = express();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const port = 3000;

let dbURI = 'mongodb+srv://2431871prince_db_user:7qyiahrIZ9pXoa8F@cluster1.ls82wmq.mongodb.net/?appName=Cluster1';
mongoose.connect(dbURI)
.then(()=> console.log("connected successfully to the database"))
.catch((err)=>console.error('error in db connection:',err));

const userSchema = new mongoose.Schema({
    username:{type:String , required:true , unique:true},
    password:{type:String , required:true}
});

const user = mongoose.model('user',userSchema);


app.use(express.json());

app.get('/',(req, res)=>{
    res.sendFile(path.join(__dirname,'index.html'));

});
app.post('/signin', async(req,res)=>{

    console.log('Received signin request with body:', req.body);
    try{
            let username = req.body.username;
            let password = req.body.password;
    let hashedPassword = await bcrypt.hash(password , saltRounds);
    let userData = {username, hashedPassword};


         const newUser = new user({
         username: username,
         password: hashedPassword
        })
        await newUser.save();
        res.status(200).json({message:"user created successfully"});

    }
    catch(error){
        console.error('error during hashing:',error)
    }
  

});
        

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});