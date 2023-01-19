const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://Nischay:Nischay@crudd.qoju4.mongodb.net/employee_manager?retryWrites=true&w=majority", {
    useNewUrlParser: true
});
mongoose.set('strictQuery', false);