const functions = require('firebase-functions');
const firebase = require('firebase');
const config = require('./keys/config.json');
firebase.initializeApp(config);
const admin = require('firebase-admin');


// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
    console.log(request.body);

    var credential = firebase.auth.EmailAuthProvider.credential(request.body.email, request.body.password);

    var aaa = firebase.auth().createUserWithEmailAndPassword(request.body.email, request.body.password)
        then(function(value) {
            console.log(value);
            response.send(value);

        })
        .catch(function(error) {
            console.log(error);
            response.send(error);

        });


    // firebase.auth().signInAndRetrieveDataWithCredential(credential)
    //     .then(function(userCredential) {
    //         response.send(userCredential.user.uid);

    //     })
    //     .catch(function(error){
    //         response.send(error);
    //     });
});
