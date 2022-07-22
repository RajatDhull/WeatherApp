// require('dotenv').config();
const express = require("express");
const http = require("http");
const fs = require("fs");
const path=require('path');
var requests = require("requests");
const ejs=require('ejs');
const app=express();
const port=8000;

app.use(express.static(path.join(__dirname, "./css")));
//using view engine ejs
app.set('view engine','ejs');
app.set('views','./views');
app.use(express.urlencoded({ extended: true }))


//variables
var city1="Jind";
var country1,temp1,feelslike1,tempstatus1,speed1,humidity1;
var msg;

//this part is for initial view of our website..at that time only jind district temperature will be shown and whenever we post some other request, then accordingly their temperature will be shown using post request
app.get('/',(req,res)=>{
  requests(`https://api.openweathermap.org/data/2.5/weather?q=${city1}&appid=eb89d801b3c1b2950ccfcc72e67abc48`)
  .on("data",function(chunk){
    let object=JSON.parse(chunk);
            if(object.cod==200){
    city1=object.name;
            country1=object.sys.country;
            temp1=Math.round(object.main.temp-273.15);
            feelslike1=Math.round(object.main.feels_like-273.15);
            tempstatus1=object.weather[0].main;
            speed1=object.wind.speed;
            humidity1=object.main.humidity;}
            else if(object.cod==404){
              city1="unknownCity";
              msg=object.message;
            }
  })
  .on('end', function (err) {
    if (err) 
        return console.log('connection closed due to errors', err);
        if(city1 != "unknownCity"){
    res.render("home",{
        location: `${city1}, ${country1}`,
        temp: temp1,feeltemp:feelslike1,
        tempStatus: tempstatus1,
        windspeed: speed1,
        humidity: humidity1,
      })}
      else{
        res.render('home',{
          location: `${msg}. Please enter correct city name!!!"`,
          temp:"",feeltemp:"",
          tempStatus:"",
          windspeed:"",
          humidity:""
        })
      }
});
});

app.post('/',(req,res)=>{
  const city2=req.body.city;
  console.log(city2);
  requests(`https://api.openweathermap.org/data/2.5/weather?q=${city2}&appid=eb89d801b3c1b2950ccfcc72e67abc48`)
  .on("data",function(chunk){
    let object=JSON.parse(chunk);
            if(object.cod==200){
            city1=object.name;
            country1=object.sys.country;
            temp1=Math.round(object.main.temp-273.15);
            feelslike1=Math.round(object.main.feels_like-273.15);
            tempstatus1=object.weather[0].main;
            speed1=object.wind.speed;
            humidity1=object.main.humidity;}
            else if(object.cod==404){
              city1="unknownCity";
              msg=object.message;
            }
  })
  .on('end', function (err) {
    if (err) 
        return console.log('connection closed due to errors', err);
        if(city1!="unknownCity"){
        res.render("home",{
        location: `${city1}, ${country1}`,
        temp: temp1,feeltemp:feelslike1,
        tempStatus: tempstatus1,
        windspeed: speed1,
        humidity: humidity1,
    });}
    else{
      res.render('home',{
        location: `${msg}. Please enter correct city name!!!"`,
        temp:"",feeltemp:"",
        tempStatus:"",
        windspeed:"",
        humidity:""
      })
    }
});
});

app.get("*",(req,res)=>{
    res.status(404).send("<h1>Oops!! Page not found</h1>");
});

app.listen(port,function(err){
    if(err){
      console.log('Error occured'+err);
    }
    else{
      console.log('Server working fine');
    }
})