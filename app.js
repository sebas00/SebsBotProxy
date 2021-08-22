var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { google } = require('googleapis');
const gkeys = require('./googlekeys.json');
const unirest = require('unirest');

const mongoose = require('mongoose')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var hangoutsRouter = require('./routes/hangouts');
var twilioRouter = require('./routes/twilio');
var confRouter = require('./routes/conf');
var piRouter = require('./routes/pibot');
var robloxRouter =  require('./routes/roblox');
const BotConfig = require('./models/botconfig')
var helmet = require('helmet');

// Connection URL
const mongourl = process.env.MONGODB_URI;

//var n = url.lastIndexOf('/');
//var dbName = url.substring(n + 1);

function postMessage(msg) {
  return new Promise(function(resolve, reject) {
      getJWT().then(function(token) {
          unirest.post('https://chat.googleapis.com/v1/spaces/' + app.locals.spaceid + '/messages')
              .headers({
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + token
              })
              .send(JSON.stringify({
                  'text': msg ,
              }))
              .end(function(res) {
                  resolve();
              });
      }).catch(function(err) {
          reject(err);
      });
  });
}

function getJWT() {
  return new Promise(function(resolve, reject) {
    let jwtClient = new google.auth.JWT(
      gkeys.client_email,
      null,
      gkeys.private_key, ['https://www.googleapis.com/auth/chat.bot']
    );

    jwtClient.authorize(function(err, tokens) {
      if (err) {
        console.log('Error create JWT hangoutchat');
        reject(err);
      } else {
        resolve(tokens.access_token);
      }
    });
  });
}



var app = express();
app.locals.la  = require('./liveagent-sdk-nodejs/liblist');
app.locals.clients = [];
app.use(helmet())
//app.locals.clients = [];
//app.locals.reso;
app.locals.txtHandler = (msg) => {
  //const result = client.send(msg);
  postMessage(msg);
  //app.locals.reso.json({return : msg})

  //console.log("send msg: " + msg + ", result: " + result);
}
app.locals.opt = {
    endpointUrl: "https://d.gla3-phx.gus.salesforce.com/chat/rest/", // example: https://endpoint.saleforce.com/chat/rest/
    version: 48,
    organizationId: "00DB0000000YRSt",
    deploymentId: "572B00000001Oue",
    buttonId: "573B00000001Y96",
    botid: "appie"
    
}



mongoose.connect(mongourl, { useNewUrlParser: true })
const db = mongoose.connection;
app.locals.db = db;
db.on('error', (error) => console.error(error))
db.once('open', async () => {console.log('connected to database');
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
})

// proxy: "http://{proxy url}:{proxy port}", // example: http://proxy.server.com:8080
app.locals.clientInfo = {
    name: "example client",
    language: "en_US",
    screenResolution: "none",
    visitorName: "wsProxy",
}




app.locals.respo = {now : "here", numby :1};
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/hangouts', hangoutsRouter);
app.use('/twilio', twilioRouter);
app.use('/conf', confRouter);
app.use('/pibot', piRouter);
app.use('/roblox', robloxRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
