const la  = require('../');

const opt = {
    endpointUrl: "https://{your domain}/chat/rest/", // example: https://endpoint.saleforce.com/chat/rest/
    version: 40,
    organizationId: "your sf org id",
    deploymentId: "your deployment id",
    buttonId: "your button/invitation id",
    proxy: "http://{proxy url}:{proxy port}", // example: http://proxy.server.com:8080
}

const clientInfo = {
    name: "example client",
    language: "en_US",
    screenResolution: "none",
    visitorName: "Augustine.x.Nguyen",
}

const client = new la.Client(opt, clientInfo);

const txtHandler = (msg) => {
    const result = client.send(msg);
    console.log("send msg: " + msg + ", result: " + result);
}

client.start(txtHandler);

process.on('SIGINT', () => {
    console.log("press ctrl + c, wait to stop the client...");
    client.stop(() => console.log("stop client successfully."));
});

