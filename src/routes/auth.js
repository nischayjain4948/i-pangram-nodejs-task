const router = require("express").Router();
const User = require("../models/employee");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "ManagerisHere";


// register api for register the particular user or manager!
router.post("/register", async (req,res)=>{
    try{
        console.log(req.body);
const {firstName, lastName, gender, hobbies, email, password, isManager=false } = req.body;
if(!(firstName && lastName && gender && hobbies, email && password )){
    return res.status(410).json({message:"Please fill all the input values!"});
}
if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
    return res.status(510).json({ message: "Email not valid!" });
 }
if(password.length < 8 || password.length > 20){
    return res.status(510).json({message:"password length must be between 8-20 length!"})
}
const regularExpression  =/^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
if(!regularExpression.test(password)){
    return res.status(510).json({message:"password should contain atleast one number and one special character!"});
}
const user = new User({firstName, lastName, gender, hobbies, email, password, isManager});
await user.save();
return res.status(200).json({message:"user registered successfully"});

}
catch(err){
    console.log("RegisterError", err);
}
})



// login api,
router.post("/login", async (req,res)=>{
    try{
 const {email, password} = req.body;
 if(!(email && password)) {
    return res.status(410).json({message:"Please fill the email and password both"});
 }
 const user =  await User.findOne({email, password});
 if(!user){
    return res.status(200).json({message:"User not found"});
 }
if(user.isManager){
    jwt.sign({email, password}, SECRET_KEY, { expiresIn: "2d" }, (error, token) => {
        console.log(token);
        return res.status(200).json({ message: "manager Found!", token });
      });
}else{
 return res.status(200).json({message:"user found", user});
}
}
catch(err){
    console.log("LoginError", err);
}
})

const isMangerCheck = async (req,res,next) =>{

    const bearerHeader = req.headers["session"];
    if (typeof bearerHeader !== "undefined") {
        jwt.verify(bearerHeader, SECRET_KEY, (err, authData)=>{
          if(err){
            return res.status(510).json({message:"token is invalid || unauthorized access "});
          }
          const {email, password} = authData;
          const manager = User.findOne({email, password, isManager:true});
          if(!manager){
            return res.status(401).json({message:"unauthorized access"});
          }
          next();
        })
    }
    else{
        return res.status(410).json({message:"token is not found"});
    }

}

module.exports = {userRoutes:router, isMangerCheck};