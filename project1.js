var express=require("express");
var app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;
let server=require('./server');
let config=require('./config');
let middleware=require('./middleware');
const response=require('express');
const url='mongodb://127.0.0.1:27017';
const dbname='hospitalinventory';
let db
MongoClient.connect(url,{useUnifiedTopology:true},(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbname);
    console.log(`connected database : ${url}`);
    console.log(`database: ${dbname}`);
});

app.get('/hospitaldetails', middleware.checkToken,function(req,res){
    console.log("Hospital Details");
    var data=db.collection('hospitaldetails').find().toArray().then(result=>res.json(result));
});

app.get('/ventilatordetails', middleware.checkToken,(req,res)=>{
    console.log("Ventilators Details");
    var ventilatordetails=db.collection('ventilatordetails').find().toArray().then(result=>res.json(result));
});

app.post('/searchventbystatus', middleware.checkToken,(req,res)=>{
    var status=req.body.status;
    console.log(status);
    var ventilatordetails=db.collection('ventilatordetails').find({"status":status}).toArray().then(result=>res.json(result));
});

app.post('/searchventbyname', middleware.checkToken,(req,res)=>{
    var status=req.query.name;
    console.log(name);
    var ventilatordetails=db.collection('ventilatordetails').find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});

app.put('/updateventilator' , middleware.checkToken,(req,res)=>{
    var ventid={vid:req.body.vid};
    console.log(ventid);
    var newvalues={$set:{status:req.body.status}};
    db.collection("ventilotordetails").updateOne(ventid,newvalues,function(err,result){
        res.json('1 document update');
        if(err) throw err;
    });
});

app.post('/addventilatorbyuser',middleware.checkToken,(req,res)=>{
    var hid=req.body.hid;
    var vid=req.body.vid;
    var status=req.body.status;
    var name=req.body.name;
    var item=
    {
        hid:hid, vid:vid, status:status, name:name
    };
    db.collection('ventilatordetails').insertOne(item,function(err,result){
        res.json('Item inserted');
    });
});

app.delete('/delete',middleware.checkToken,(req,res)=>{
    var myquery=req.query.vid;
    console.log(myquery);
    var myquery1={vid:myquery};
    db.collection('ventilatordetails').deleteOne(myquery1,function(err,obj){
        if(err) throw err;
        res.json('1 document deleted');
    });
});
app.listen(1200);