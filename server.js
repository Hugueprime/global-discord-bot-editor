const Discord = require('discord.js');
const client = new Discord.Client();
client.login('');

client.on('ready', () => {
    console.log('bot ready');


});

const express = require('express');
const cors = require('cors')
var app = express();
var port = 8080;
// respond with "hello world" when a GET request is made to the homepage


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// app.use(cors({origin: '*'}));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/', function(req, res) {
    if(req.query.token == "123"){

        client.guilds.cache.get(req.query.guild).channels.cache.get(req.query.channel).messages.fetch(req.query.msg).catch(error => {
            console.log("Fetch has failed because initial message was deleted !")
        }).then((message)=>{
            res.send(message.content)
        })
    }

//   http://localhost:8080/?token=123&guild=718471398426673252&channel=718471398938509332&msg=807665330671059002
});

app.get('/modif/', function(req, res) {
    let content = req.query.content;
    content = decodeURIComponent(content)
    // while(content.indexOf("b_r") != -1){
        // console.log(content)
        // content = content.replace("b_r", "\n");
    // }
    
    if(req.query.token == "123"){
        console.log(req.query.content)
        client.guilds.cache.get(req.query.guild).channels.cache.get(req.query.channel).messages.fetch(req.query.msg).catch(error => {
            console.log("Fetch has failed because initial message was deleted !")
        }).then((message)=>{
            try {
                message.edit(content)
                res.send("good")
            } catch (error) {
                res.send(error)
            }
        })
    }

//   http://localhost:8080/?token=123&guild=718471398426673252&channel=718471398938509332&msg=807665330671059002
// client.guilds.cache.get("718471398426673252").channels.cache.get("718471398938509332").send("__underline__ **maj**")
});