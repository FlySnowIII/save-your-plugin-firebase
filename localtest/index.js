const request = require('request');

var URL = 'http://localhost:5000/vscode-save-your-plugin/us-central1/helloWorld';

request.post({
    uri: URL,
    headers: { "Content-type": "application/json" },
    json: {
        // JSONをPOSTする場合書く=
        email:"pengfei.t@gmail.com",
        password:"sun121025"
    }
}, (err, res, data) => {
    console.log(data);
});