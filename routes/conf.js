var express = require('express');
var router = express.Router();
const BotConfig = require('../models/botconfig');

router.get('/', function(req, res){
    res.render('conf', {title: 'Whatsapp Bot Config'});
});
router.post('/parse', function(req, res){
    //console.log(req.body);
    var regex = /embedded_svc.init\(([^\)]+.*)\);/;
    //let regexp = new RegExp(regex);
    var settings = req.body.snippet.match(regex);
    console.log(settings);
regex = /(00D)(.{12})/g
var orgid = settings[1].match(regex);
console.log(orgid);
regex = /(573)(.{12})/g
var buttonId = settings[1].match(regex);
regex = /(572)(.{12})/g
var deploymentId = settings[1].match(regex);
regex = /baseLiveAgentURL: ('(.*)')/;
var endpoint = settings[1].match(regex);
console.log(endpoint[2]);
var endpointUrl = endpoint[2] + '/rest/';
//console.log('endp', endpointUrl);
//console.log(orgid);
    //var deployid = req.body.match();
//console.log(settings[1]);
   
    res.json({organizationId: orgid[0], endpointUrl : endpointUrl, buttonId : buttonId[0], deploymentId : deploymentId[0]});
});
router.post('/findbotid', function(req, res){
    console.log(req.body);
    BotConfig.find({ botid: req.body.botid }, function (err, configs) {
        if (err) return console.error(err);
        console.log(configs);
        if(configs[0]){
        var botconfigret = {botid : configs[0].botid, organizationId : configs[0].organizationId, buttonId : configs[0].buttonId, deploymentId : configs[0].deploymentId, endpointUrl : configs[0].endpointUrl};
        
        res.json({botid: botconfigret.botid, conf: botconfigret});
 
      } else {

        res.json({botid: req.body.botid, conf: { botid : req.body.botid}});
      }
    
    })
    //let regex = /embedded_svc.init\(([^\)]+.*)\);/;
    //let regexp = new RegExp(regex);
    //var settings = req.body.snippet.match(regex);
    //var deployid = req.body.match();
//console.log(settings[1]);
   
    //res.json({botid: req.body.botid});
});

router.post('/', function(req, res){
    console.log(req.body);
    let regex = /embedded_svc.init\(([^\)]+.*)\);/;
    //let regexp = new RegExp(regex);
    //var settings = req.body.snippet.match(regex);
    //var deployid = req.body.match();
//console.log(settings[1]);
const subscriber = {
    botid : req.body.botid,
    endpointUrl: req.body.endpointUrl,
      version: 48,
      organizationId: req.body.organizationId,
      deploymentId: req.body.deploymentId,
      buttonId: req.body.buttonId,
      channnel: 'whatsapp',
      userid: req.body.botid
  }
  
  
    BotConfig.findOneAndUpdate({ botid: req.body.botid }, subscriber, {
        new: true,
        upsert: true 
      }, function (err, configs) {
        if (err){
          res.render('confirm', {botconfig: configs});
         //  return console.error(err);
        }
        console.log(configs);
        res.render('confirm', {botconfig: configs});
      });
    //onsole.log(newSubscriber)
  
    
});

/*
const subscriber = new BotConfig({
  endpointUrl: "https://d.la1-c1-cdg.salesforceliveagent.com/chat/rest/", // example: https://endpoint.saleforce.com/chat/rest/
    version: 47,
    organizationId: "00D3X000001tG4K",
    deploymentId: "5723X000000LKh0",
    buttonId: "5733X000000LKld"
})

try {
  const newSubscriber = await subscriber.save()
  console.log(newSubscriber)
} catch (err) {
  console.log(err)
}
*/

module.exports = router;