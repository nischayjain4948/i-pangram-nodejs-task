const mongoose = require("mongoose");
const validator = require("validator");

const ManagerFields = mongoose.model('manager', {
    departmentName:{
        type:String,
        required:true,
        trim:true
    },
     categoryName:{
        type:Array,
    },
    location:{
        type:String,
        trim:true,
        required:true
    }, 
    salary:{
    type: Number,
    required:true
    },
    employee_id:{
        type:String,
        required:true
    }
})

module.exports = ManagerFields;