const express=require("express");
const app=express();

require("./Startup/db")();
require("./Startup/routes")(app);


app.get("/",(req,res)=>{
    console.log("Server-Health : OKAY");
    res.status(200).send({result:"Server-Health:Okay"});
})


const PORT = process.env.PORT || 3001;
const server=app.listen(PORT,()=>{
    console.log(`Server-Started at PORT : http://localhost:${PORT}`);
});

module.exports=server;