const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
client.login(config.token);

client.on('ready', () => {
    console.log('bot ready');
});

const express = require('express');
var app = express();
var port = 8080;

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

//exemple of request : http://localhost:8080/get?token=42&guild=424242424242424242&channel=424242424242424242&msg=424242424242424242
app.get('/get', function(req, res) {//send msg to file
    console.log("Request get")
    if(req.query.token == config.client_token){
        client.guilds.cache.get(req.query.guild).channels.cache.get(req.query.channel).messages.fetch(req.query.msg).catch(error => {
            res.status(500).send("msg doesn't exist");
        }).then( async(msg)=>{
            if(msg.author.id != client.user.id){
                res.status(500).send("msg not from bot");
            }else{
                let content = msg.content;
                msg.mentions.users.forEach(element => {//change <@id_user> to @username
                    content = content.replace("<@"+element.id+">", "@"+element.username);
                });

                //change <#id_channel> to #channel
                const regexp = /#/g;
                const array = [...content.matchAll(regexp)];
                for(let k = array.length-1; k >= 0;k--){
                    let end = content.substr(array[k]["index"], content.length).indexOf(" ")-2;
                    let otherend = content.substr(array[k]["index"], content.length).indexOf("\n")-2;
                    if((end > otherend || end < 0) && otherend > 0){
                        end  = otherend;
                    }else if(end < 0){
                        end = content.length;
                    }
                    let pin = content.substr(array[k]["index"]+1, end);
                    let channel = await client.guilds.cache.get(req.query.guild).channels.cache.find(x => x.id == pin);
                    content = content.replace("<#"+pin+">", array[k][0]+channel.name)
                }
                res.send(content)
            }
        })
    }else{
        res.status(500).send("Wrong token !");
    }
});

app.get('/edit', function(req, res) {
    console.log("Request edit");
    let content = req.query.content;
    content = decodeURIComponent(content)
    if(req.query.token == config.client_token){
        client.guilds.cache.get(req.query.guild).channels.cache.get(req.query.channel).messages.fetch(req.query.msg).catch(error => {
            console.log(error)
            if(error){
                res.status(500).send("fetch failed, message probably deleted");
            }
        }).then(async (message)=>{
            try {
                content = await tag(content, req.query.guild)
                if(content.length < 2000){
                    if(content.length > 0){
                        message.edit(content)
                        res.status(200)
                    }else{
                        res.status(500).send("server wants chars, server need chars, give it chars");
                    }
                }else{
                    res.status(500).send("too much chars server doesn't like it, less chars server happy");
                }
            } catch (error) {
                console.log("fafeiled")
                res.send(error)
            }
        })
    }else{
        res.status(500).send("Wrong token !");
    }
});

//send a new message
app.get('/new', async function(req, res) {
    console.log("Request new");
    let content = req.query.content;
    content = decodeURIComponent(content)
    if(req.query.token == config.client_token){
        try {
            content = await tag(content, req.query.guild)
            if(content.length < 2000){
                if(content.length > 0){
                    client.guilds.cache.get(req.query.guild).channels.cache.get(req.query.channel).send(content).catch(error => {
                        res.status(500).send("Channel doesn't exist");
                    }).then(async (chan)=>{
                        res.status(200);
                    });
                }else{
                    res.status(500).send("server want chars, server need chars, give it chars");
                }
            }else{
                res.status(500).send("too much chars server doesn't like it, less chars server happy");
            }
        } catch (error) {
            res.send(error)
        }
    }else{
        res.status(500).send("wrong token");
    }
});

async function tag(content, guild){//change #channel and @username in <#id_channel> and <@id_user>
    const regexp = /(#)|(@)/g;
    const array = [...content.matchAll(regexp)];//find matches
    for(let k = array.length-1; k >= 0;k--){
        let end = content.substr(array[k]["index"], content.length).indexOf(" ")-1;//find end of name
        let otherend = content.substr(array[k]["index"], content.length).indexOf("\n")-1;//find end if by new line
        if((end > otherend || end < 0) && otherend > 0){//find which end if closer
            end  = otherend;
        }else if(end < 0){
            end = content.length;
        }
        let pin = content.substr(array[k]["index"]+1, end);//get name
        if(pin != "everyone" && pin != "here"){
            if(array[k][0] == "@"){//if user find id with name
                await client.guilds.cache.get(guild).members.fetch({
                    query:""+pin+"",
                    limit: 1
                    }).then((query)=>{
                        query.forEach(user => {
                            content = content.replace(array[k][0]+pin, "<"+array[k][0]+user.user.id+">")
                        });
                    })
            }else if(array[k][0] == "#"){//if channel find id with name
                let channel = await client.guilds.cache.get(guild).channels.cache.find(x => x.name == pin);
                content = content.replace(array[k][0]+pin, "<#"+channel.id+">")
            }
        }
    }
    return content;
}