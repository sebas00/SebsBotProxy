const mongoose = require('mongoose')

const botconfigSchema = new mongoose.Schema({
  endpointUrl: {
    type: String,
    required: true
  },
  organizationId: {
    type: String,
    required: true
  },
  deploymentId: {
    type: String,
    required: true
  },
  buttonId: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true,
    default: 48
  },
  userid: {
    type: Number,
    required: false
  },
  channel: {
    type: String,
    required : false
  },
  botid: {
    type: String,
    required : true
  }
})
/*
endpointUrl: "https://d.la1-c1-cdg.salesforceliveagent.com/chat/rest/", // example: https://endpoint.saleforce.com/chat/rest/
    version: 47,
    organizationId: "00D3X000001tG4K",
    deploymentId: "5723X000000LKh0",
    buttonId: "5733X000000LKld"

*/
module.exports = mongoose.model('BotConfig', botconfigSchema)