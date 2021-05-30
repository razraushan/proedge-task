

/************************** Adding Requirements for the project ***************************/
/************************** Setting up the project ***************************************/

var express = require('express');
const bodyParser = require("body-parser");
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fetch = require("node-fetch");
var http=require('http');
var cors=require("cors");
/************************* Setting up the express ******************************************/

var app=express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));



/****************************** API *******************************************/



/********************** API *************************/
let resultMap=new Map();
function callAPI(rollnumbers)
{
    return new Promise(function (resolve,reject) {
        commonUrl="http://proedge.me/test.php?rollnumber=";var j=0;
        for(var i in rollnumbers)
        {
            var request = new XMLHttpRequest();
            finalUrl=commonUrl+rollnumbers[i];
            request.open('GET',finalUrl);
            request.onload=function () {
                resultMap.set(rollnumbers[j],this['responseText']);j++;
                if(j===rollnumbers.length)
                { resolve(resultMap);}
            }
            request.send();
        }
    });

}

app.post("/receiveInput",function (req,res) {
    //The following lines receive the input as a string from the frontend and convert it into JSON object
    var inputString=req.body['csv'];
    var input = inputString.split(',')
    var rollNumbers=[];
    for (var a in input)
    {
        rollNumbers.push(input[a]);
    }
    var responses=[];var completed_requests=0;
    let resultMap=new Map();

    async function doAllProcessing()
    {
        var finalResponse=await  callAPI(rollNumbers);
        finalJsonObject=[];
        for (let [key, value] of finalResponse)
        {
            tempJson={};
            tempJson['Roll_Number']=key;tempJson['Result']=value;
            finalJsonObject.push(tempJson);
        }
        finalResponse.clear();
        res.setHeader('content-type','application/json');
        res.json((finalJsonObject));}
        doAllProcessing();
});

/***************************** Setting up the API to run on port 8000 ***********/


app.listen(8000,function(req,res)
{
    console.log("Server live on port 8000");
});