const express = require ('express');
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
const {Client} = require('pg');

const connectionString ='postgres://postgres:5463@localhost:5432/account';
const client = new Client({
    connectionString:connectionString
});
client.connect();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'));


router.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname + '/public/login.html'));
    
   
});
app.post('/auth',(req,res)=>{

 var username = req.body.username;
 var password = req.body.password;
 console.log(username);
 console.log(password);
 


     if(username && password){
        client.query(`select * from member where username = '${req.body.username}' AND  password = '${req.body.password}'`,(err,result)=>{
            const rows = result.rows;
            console.log(rows.length)
            if(rows.length > 0){
                res.redirect('/home')
            }else{
                res.send('invalid username and password');
            
            }

        });
        
       
    
  

         
     }else{
         res.send('enter credentials')
     }
 
});
router.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname + '/public/signup.html'));
   
   
});

app.post('/data',(req,res)=>{
client.query(`insert into member (username,email,password,job_role) values ('${req.body.username}','${req.body.email}','${req.body.password}','${req.body.job_role}')`,(err,result) =>{
       res.json({"message":"inserted sucessfully"})
        if(err) throw err;
   })

})








app.use('/',router);
var PORT =5000;
app.listen(PORT,process.env.PORT || 5000,()=>console.log(`server running ${PORT}`));