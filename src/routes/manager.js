const router = require("express").Router();
const mongoose = require("mongoose");
const {isMangerCheck} = require("../routes/auth");
const ManagerCollection = require("../models/managerFields");
const User = require("../models/employee");


// createDepartement
router.post("/department/create", isMangerCheck, async (req,res)=>{
    try{
   const {employee_id} = req.body;
   if(!employee_id){
    return res.status(410).json({message:"Please provide employee id"});
   }
   if(employee_id){
    const  _id = mongoose.Types.ObjectId(employee_id);
    const employee = await User.findOne({_id});

    if(!employee){
        return res.status(410).json({message:"invalid employee id!"});
    }
    var {firstName, lastName, email} = employee
  
   }
   const newDoc = {...req.body, firstName, lastName, email };
   const departementCollection = new ManagerCollection(newDoc);
   await departementCollection.save();
   return res.status(200).json({message:"department set successfully for the particular user"});
}
catch(err){
    console.log("createerror", err);
}
})



// updateEmployee Departement
router.patch("/department/update/:id", isMangerCheck , async (req,res)=>{
    try{
       const updateDepartment = await ManagerCollection.findOneAndUpdate({employee_id:req.params.id}, req.body);
       if(!updateDepartment){
        return res.status(404).json({message:"no user found"});
       }
        return res.status(200).json({message:"department update successfully!"});
    }
    catch(err){
        console.log("UpdateError", err);
    }
})

// Delete the Departement for the particular employee!
router.delete("/department/delete/:id", isMangerCheck, async (req,res)=>{
    try{
        
        const deleteDepartment = await ManagerCollection.deleteOne({employee_id:req.params.id})
        if(!deleteDepartment){
            return res.status(404).json({message:"unable to delete"});
        }
        return res.status(200).json({message:"Department deleted successfully"});

    }catch(err){
        console.log("Error while deleting...", err);
    }
})

/*
route for manager will see 5 document in a single page!
*/

router.get("/department/find", isMangerCheck, async (req,res)=>{
    try{
        
        let page = req.query.page;
        page = (page < 0) ? 0 : page;
        let skip;
        skip = page * 5;
        const allDepartment = await ManagerCollection.find({}).skip(skip);
        if(!allDepartment){
            return res.status(200).json({result:[]});
        }
        return res.status(200).json({result:allDepartment});
    }
    catch(err){
        console.log("Error while finding..", err);
    }

})

router.get("/department/findByLocation", isMangerCheck, async (req,res)=>{
    try{
   const {location, department} = req.query;
   if(location && department){
   let departmentResult = await ManagerCollection.find({
    $or: [
      { location: {$regex: location } },
      { departmentName: { $regex: department } }
    ],
  });
  if(!departmentResult){
    return res.status(200).json({result:[]});
  }
  return res.status(200).json({result:departmentResult});
}
else if(department && !location){
    let departmentResult = await ManagerCollection.find(
          { departmentName: { $regex: department } }
      );
     if(!departmentResult){
        return res.status(200).json({result:[]});
     }

       let result = [];
       await Promise.all(departmentResult.map(async (item)=>{
        const employee_id =  mongoose.Types.ObjectId(item.employee_id);
         result.push(await User.find({_id:employee_id}).sort({firstName:-1}));
     }))
     return res.status(200).json({result});
}

}
catch(err){
    console.log("FindByLocationError", err)
}

})

module.exports = {managerRoutes:router};