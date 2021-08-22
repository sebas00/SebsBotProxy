var express = require('express');
var router = express.Router();
const BotConfig = require('../models/botconfig');
const request = require('request');
const accountSid = 'xxx';
const authToken = 'xxx';
const twilioclient = require('twilio')(accountSid, authToken);

var responseObject = {
    "actions": [
    ]
};

router.post('/start/:botname', (req, res) => {
    const botname = req.params.botname;
  
  console.log('twiliostart', req.body);
  // Case 1: When BOT was added to the ROOM
  function txtHandler (msg, tres)  {
    //const result = client.send(msg);
    /*
    request.post('https://sdodemo-main-166ce2cf6b6-17014b1dd3e.force.com/consumer/services/apexrest/ProxyMessage/',{
        
        json: {source : "bot", message : msg, botproxyid : req.body.DialogueSid}
        
      }, function(error, response, body){
        //console.log(response)
        console.log(error)
      console.log(body);
    }
    );
*/
    responseObject = {
        "actions": [
        ]
    };
    responseObject.actions.push(

        {
			"collect": {
				"name": "collect_comments",
				"questions": [
					{
						"question": msg,
						"name": "comments"
					}
				],
				"on_complete": {
					"redirect": "https://sdm-kidsbot.herokuapp.com/twilio/start/bobot"
				}
			}
		}


        );
        try{
          //console.log('resstatus', req.app.locals.clients[req.body.DialogueSid].res.finished);
          if(req.app.locals.clients[req.body.DialogueSid].res.finished == false){
            req.app.locals.clients[req.body.DialogueSid].res.json(responseObject);
          } else {
            if(req.body.Channel != 'messaging.whatsapp'){return;}
            console.log('no valid response, need to push out');
            twilioclient.messages
  .create({
     
     from: 'whatsapp:+14155238886', 
     body: msg,
     to: req.body.UserIdentifier
   })
  .then(message => console.log(message.sid));
          }
        }
        catch(err){
            console.log(err);
        }
    //app.locals.reso.json({return : msg})
      
    //console.log("send msg: " + msg + ", result: " + result);
  }

  if(req.app.locals.clients[req.body.DialogueSid] && req.app.locals.clients[req.body.DialogueSid].hasSession){
    var jsonDataObj = {source: 'customer', message: req.body.CurrentInput, botproxyid : req.body.DialogueSid};
    var jsonSend = JSON.stringify(jsonDataObj);
    request.post({
        url: 'https://sdodemo-main-166ce2cf6b6-17014b1dd3e.force.com/consumer/services/apexrest/ProxyMessage/',
        json: jsonDataObj
        
      }, function(error, response, body){
      console.log(body);
    });
    req.app.locals.clients[req.body.DialogueSid].res = res;
    try{
 req.app.locals.clients[req.body.DialogueSid].send(req.body.CurrentInput);
    } catch(error) {
        console.log('res not here', error);
    }
  } else {
    console.log('start new bot')
    //var jsonDataObj2 = {'so' : 'bot'};
    //var jsonSend = JSON.stringify(jsonDataObj);
    request.post('https://sdodemo-main-166ce2cf6b6-17014b1dd3e.force.com/consumer/services/apexrest/ProxyMessage/',{
        
        json: {source : "botProxy", message : "start new session", botproxyid : req.body.DialogueSid}
        
      }, function(error, response, body){
        //console.log(response)
        console.log(error)
      console.log(body);
    }
    );
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
   console.log('memory', req.body.Memory);
   var mems = JSON.parse(req.body.Memory);
    if(mems.botid){
     botid = mems.botid;
    }
    console.log('twilio', mems.twilio["google-assistant"])
    if(mems.twilio["google-assistant"]){
     langs=mems.twilio["google-assistant"].user.locale;
    }
    if(req.body.UserIdentifier){
      botid = req.body.UserIdentifier.replace('whatsapp:', '');
    }
    var clientInfo = {
      name: "Spaghetti Proxy User",
      language: "en_US",
      screenResolution: "none",
      visitorName: "wsProxy",
      prechatDetails : [
        {"label":"proxyChannel__c","value": req.body.Channel,"displayToAgent":true,"transcriptFields": ["proxyChannel__c"]},
        {"label":"proxyLanguage__c","value": langs,"transcriptFields":[ "proxyLanguage__c" ],"displayToAgent":true},
        {"label":"proxyUserId__c","value": botid,"transcriptFields":[ "proxyUserId__c" ],"displayToAgent":true},
        {"label":"botProxyId__c","value": req.body.DialogueSid,"transcriptFields":[ "botProxyId__c" ],"displayToAgent":true}
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
          req.app.locals.clients[req.body.DialogueSid] = new req.app.locals.la.Client(botconfig, clientInfo);
        req.app.locals.clients[req.body.DialogueSid].res = res;
        req.app.locals.clients[req.body.DialogueSid].startmessage = req.body.CurrentInput;
 req.app.locals.clients[req.body.DialogueSid].start(txtHandler);
 return;
        }
        if(configs[0]){
        botconfig = configs[0];} 
        console.log('myconfig', configs);
        req.app.locals.clients[req.body.DialogueSid] = new req.app.locals.la.Client(botconfig, clientInfo);
        req.app.locals.clients[req.body.DialogueSid].res = res;
        req.app.locals.clients[req.body.DialogueSid].startmessage = req.body.CurrentInput;
 req.app.locals.clients[req.body.DialogueSid].start(txtHandler);
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
