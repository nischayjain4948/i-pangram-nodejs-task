const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
require("./src/db/config");
app.use(express.json());

const {userRoutes} = require('./src/routes/auth');
app.use("/api/user", userRoutes);

const {managerRoutes} = require("./src/routes/manager");
app.use("/api/manager", managerRoutes);

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})



