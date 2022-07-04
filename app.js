//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const dotenv = require('dotenv').config();
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extende: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/2d10a9077a";

  const options = {
    method: "POST",
    auth: process.env.MAILCHIMP_AUTH
  };

  const request = https.request(url, options, function(response){
    response.on("data", function(data){

      if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      }else{
        res.sendFile(__dirname + "/failure.html");
      }

    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is runing on port 3000.");
});
