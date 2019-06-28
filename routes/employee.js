var express = require('express');
var router = express.Router();
var fs = require('fs');
var mysql=require('mysql')

var multer=require('multer');
var storage=multer.diskStorage({
  destination:(req,file,path)=>
{path(null,'public/images')}
,
filename:(req,file,path)=>{
 path(null,file.originalname)}
});
var upload = multer({storage:storage})


var pool=mysql.createPool({
host:'localhost',
port:3306,
user:'root',
password:'12345',
database:'employeemanagement',
connectionLimit:100,
multipleStatements:true
})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('employeeinterface', {msg: 'See Here....' });
});

router.post('/AddNewRecord',upload.single('employeepicture'), function(req, res, next) {
  console.log("BODY",req.body)
  console.log("File",req.file)
  pool.query('insert into employeedetails values(?,?,?,?,?,?,?)',[req.body.employeeid,req.body.employeename,req.body.gender,req.body.dob,req.body.designation,req.body.salary,req.file.filename],function(error,result){

    if(error)
   {
     console.log(error);
    res.render('employeeinterface', {msg: 'Fail to Submit Record...' });
   }
   else
   {
    res.render('employeeinterface', {msg: 'Record Submitted....' });
  }
   

  })
  
});

router.get('/displayAll', function(req, res, next) {

  pool.query("select * from employeedetails",function(error,result){
    if(error){ 
      { res.render("display",{data:[]})}
    }
    else{
      res.render("display",{data:result})
    }
  })
});


router.get('/displayById', function(req, res, next) {
  pool.query("select * from employeedetails where employeeid=?",[req.query.eid],function(error,result){
   if(error)
   { res.render("displayById",{data:[]})}
   else
   {
     res.render("displayById",{data:result})
   }
  
  }) 
   
});
router.post('/editdelete', function(req, res, next) {
  console.log(req.body)
  var btn=req.body.btn;

  if(btn=='Edit'){
  pool.query("update employeedetails set employeename=?,gender=?,dob=?,designation=?,salary=? where employeeid=?",[req.body.employeename,req.body.gender,req.body.dob,req.body.designation,req.body.salary,req.body.employeeid],function(error,result){
   if(error)
   { console.log(error)  }
   else
   {
    console.log(result)
   }
  
  }) 
}
else if(btn=='Delete')
{ pool.query("delete from employeedetails  where employeeid=?",[req.body.employeeid],function(error,result){
  if(error)
  { console.log(error)  }
  else
  {
   console.log(result)
  }
 
 })


}
res.redirect("displayAll")


   }); 

   router.post('/editpicture',upload.single("employeepicture"), function(req, res, next) {
    console.log('BODY',req.body)
    console.log("FILE",req.file)
    pool.query('update employeedetails set employeepicture=? where employeeid=?',[req.file.filename,req.body.employeeid],function(error,result){
     console.log(error)
    fs.unlink('public/images/'+req.body.oldpicturename, function (err) {
    if (err) 
      console.log(error);
});
     if(error)
     {}
     else{}


    })
     
    res.redirect('http://localhost:3000/employee/displayAll')
    });

module.exports = router;