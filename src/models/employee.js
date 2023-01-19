const mongoose = require("mongoose");
const validator = require("validator");

const Employees = mongoose.model('employees', {
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
     type:String, 
     require:true,
     trim:true 
    },
    gender:{
     type:String,
     required:true,
     trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
             if(!validator.isEmail(value)){
                throw new Error('Email is not valid');
             }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        trim:true
    },
     hobbies:{
        type:Array,
    },
    isManager:{
        type:Boolean
    }
})

module.exports = Employees;