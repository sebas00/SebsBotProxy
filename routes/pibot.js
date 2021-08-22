var express = require('express');
var router = express.Router();
const BotConfig = require('../models/botconfig');
const request = require('request');


var responseObject = {
    "actions": [
    ]
};

router.post('/start/:botname', (req, res) => {
    const botname = req.params.botname;
  
  console.log('pistart', req.body);
  // Case 1: When BOT was added to the ROOM
  function txtHandler (msg, tres)  {
    //const result = client.send(msg);
    /*
    request.post('https://sdodemo-main-166ce2cf6b6-17014b1dd3e.force.com/consumer/services/apexrest/ProxyMessage/',{
        
        json: {source : "bot", message : msg, botproxyid : req.body.sid}
        
      }, function(error, response, body){
        //console.log(response)
        console.log(error)
      console.log(body);
    }
    );
*/
    responseObject = {
        "reply": msg
    };
    
        try{
          //console.log('resstatus', req.app.locals.clients[req.body.sid].res.finished);
          if(req.app.locals.clients[req.body.sid].res.finished == false){
            req.app.locals.clients[req.body.sid].res.json(responseObject);
          } else {
            
            console.log('no valid response, need to push out');
          }
        }
        catch(err){
            console.log(err);
        }
    //app.locals.reso.json({return : msg})
      
    //console.log("send msg: " + msg + ", result: " + result);
  }

  if(req.app.locals.clients[req.body.sid] && req.app.locals.clients[req.body.sid].hasSession){
    /*
    var jsonDataObj = {source: 'customer', message: req.body.CurrentInput, botproxyid : req.body.sid};
    var jsonSend = JSON.stringify(jsonDataObj);
    request.post({
        url: 'https://sdodemo-main-166ce2cf6b6-17014b1dd3e.force.com/consumer/services/apexrest/ProxyMessage/',
        json: jsonDataObj
        
      }, function(error, response, body){
      console.log(body);
    });
    */
   
    req.app.locals.clients[req.body.sid].res = res;
    
    var current = req.body.CurrentInput;
    if(current == ''){
      console.log('no input');
      req.app.locals.clients[req.body.sid].res.json({reply:''});
      return

    }
    //var bb = 'hiu'
    //bb.toLowerCase
    if(current.toLowerCase() == 'one'){current = '1'} 
    else if (current.toLowerCase() == 'two'){
      current = '2'}
     else if (current.toLowerCase() == 'three'){current = '3'}

    try{
 req.app.locals.clients[req.body.sid].send(current);
    } catch(error) {
        console.log('res not here', error);
    }
  } else {
    console.log('start new bot')
    //var jsonDataObj2 = {'so' : 'bot'};
    //var jsonSend = JSON.stringify(jsonDataObj);
    /*
    request.post('https://sdodemo-main-166ce2cf6b6-17014b1dd3e.force.com/consumer/services/apexrest/ProxyMessage/',{
        
        json: {source : "botProxy", message : "start new session", botproxyid : req.body.sid}
        
      }, function(error, response, body){
        //console.log(response)
        console.log(error)
      console.log(body);
    }
    );
    */
    var botconfig = {
      
      "endpointUrl": "https://d.gla3-phx.gus.salesforce.com/chat/rest/",
      "version": 48,
      "organizationId": "00DB0000000YRSt",
      "deploymentId": "572B00000001Oue",
      "buttonId": "573B00000001Y96",
      "botid": "appi"
  }
    botid = 'default';
    var langs = 'en';
   console.log('memory', req.body.botid);
   botid = req.body.botid;
    
    console.log('twilio', req.body)
    
     langs='nl-NL';
    
    
      botid = req.body.botid
    
    var clientInfo = {
      name: "Spaghetti Proxy User",
      language: "nl_NL",
      screenResolution: "none",
      visitorName: "wsProxy",
      prechatDetails : [
        {"label":"proxyChannel__c","value": 'pi',"displayToAgent":true,"transcriptFields": ["proxyChannel__c"]},
        {"label":"proxyLanguage__c","value": langs,"transcriptFields":[ "proxyLanguage__c" ],"displayToAgent":true},
        {"label":"proxyUserId__c","value": req.body.userid,"transcriptFields":[ "proxyUserId__c" ],"displayToAgent":true},
        {"label":"botProxyId__c","value": botid,"transcriptFields":[ "botProxyId__c" ],"displayToAgent":true},
        {"label":"voicecallid__c","value": req.body.sid,"transcriptFields":[ "voicecallid__c" ],"displayToAgent":true},
        ]
  }

    console.log('foundsettings');
    /*
    if(req.body.Memory.twilio.botid){
      botid = req.body.Memory.twilio.botid
     }
*/
      BotConfig.find({ botid: botid }, function (err, configs) {
        if (err){ 
          req.app.locals.clients[req.body.sid] = new req.app.locals.la.Client(botconfig, clientInfo);
        req.app.locals.clients[req.body.sid].res = res;
        req.app.locals.clients[req.body.sid].startmessage = req.body.CurrentInput;
 req.app.locals.clients[req.body.sid].start(txtHandler);
 return;
        }
        if(configs[0]){
        botconfig = configs[0];} 
        console.log('myconfig', configs);
        req.app.locals.clients[req.body.sid] = new req.app.locals.la.Client(botconfig, clientInfo);
        req.app.locals.clients[req.body.sid].res = res;
        req.app.locals.clients[req.body.sid].startmessage = req.body.CurrentInput;
 req.app.locals.clients[req.body.sid].start(txtHandler);
      })
    


      
        
/*
const txtHandler = (msg) => {
    //const result = client.send(msg);
    res.json({return : msg})
    //console.log("send msg: " + msg + ", result: " + result);
}
*/





  //  text = `Thanks for adding me to a DM, ${req.body.user.displayName}`;
  // Case 3: Texting the BOT
  
  //return res.json(responseObject);

}})
/* GET users listing. */
router.get('/', function(req, res, next) {
  
 
  res.json(req.app.locals.respo);
});

router.get('/new', function(req,res,next)  {

  req.app.locals.client = new req.app.locals.la.Client(req.app.locals.opt, req.app.locals.clientInfo);
/*
const txtHandler = (msg) => {
    //const result = client.send(msg);
    res.json({return : msg})
    //console.log("send msg: " + msg + ", result: " + result);
}
*/
req.app.locals.reso = res;
req.app.locals.client.start(req.app.locals.txtHandler);
});

router.get('/more', function(req,res,next)  {
  //console.log(req.app.locals.client);
  req.app.locals.reso = res;
  req.app.locals.client.send('send');
});

module.exports = router;
