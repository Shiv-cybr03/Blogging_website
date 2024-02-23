const fs = require("fs")

function logGenerate(filename){
    return (req,res, next) =>{
        const currentDate = new Date();
        const dataTime = currentDate.toLocaleString(); 
        fs.appendFile(filename,`\n${dataTime} : ${req.method} : ${req.ip} - ${req.path}`, (err , data) =>{
            next();
        });
    }

}

module.exports ={
    logGenerate,
}