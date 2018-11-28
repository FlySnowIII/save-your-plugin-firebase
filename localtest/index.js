const request = require('request');

var URL = 'http://localhost:5000/vscode-save-your-plugin/us-central1/logincreate';

request.post({
    uri: URL,
    headers: { "Content-type": "application/json" },
    json: {
        // JSONをPOSTする場合書く=
        // email:"aaaaaaa.t@gmail.com",
        // password:"aaaaaa"
        email:"pengfei.t@gmail.com",
        password:"sun121025"
    }
}, (err, res, data) => {
    console.log(data);
});