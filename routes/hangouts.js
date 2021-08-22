var express = require('express');
var router = express.Router();




router.post('/:botname', (req, res) => {
  const botname = req.params.botname;
  let text = '';
  console.log('hangoutreq', req.body);
  console.log('botname', botname);

  function txtHandler (msg, tres)  {
    
    responseObject = {
        "text": msg
    };
    
        try{
          //console.log('resstatus', req.app.locals.clients[req.body.botSessionId].res.finished);
          if(req.app.locals.clients[req.body.botSessionId].res.finished == false){
  
            req.app.locals.clients[req.body.botSessionId].res.json(responseObject);
          } else {
            req.app.locals.clients[req.body.botSessionId].cache = responseObject
            console.log('no valid response, need to push out');
          }
        }
        catch(err){
            console.log(err);
        }
    //app.locals.reso.json({return : msg})
      
    //console.log("send msg: " + msg + ", result: " + result);
  }

  // Case 1: When BOT was added to the ROOM
  if (req.body.type === 'ADDED_TO_SPACE' && req.body.space.type === 'ROOM') {
    text = `Thanks for adding me to ${req.body.space.displayName}`;
  // Case 2: When BOT was added to a DM
  } else if (req.body.type === 'ADDED_TO_SPACE' &&
      req.body.space.type === 'DM') {
        req.app.locals.client = new req.app.locals.la.Client(req.app.locals.opt, req.app.locals.clientInfo);

req.app.locals.spaceid = req.body.space.name.split('/')[1];
//console.log('space', req.app.locals.spaceid);
req.app.locals.reso = res;
req.app.locals.client.start(req.app.locals.txtHandler);
    text = `Thanks for adding me to a DM, ${req.body.user.displayName}`;
  // Case 3: Texting the BOT
  } else if (req.body.type === 'MESSAGE') {


    text = `Your message : ${req.body.message.text}`;
  }
  return res.json({text});
});

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
