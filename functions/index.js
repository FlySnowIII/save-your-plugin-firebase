const functions = require('firebase-functions');
const firebase = require('firebase');
const config = require('./keys/config.json');
firebase.initializeApp(config);
const admin = require('firebase-admin');
var serviceAccount = require("./keys/vscode-save-your-plugin-firebase-adminsdk-1l6s7-e647d4b6b5.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vscode-save-your-plugin.firebaseio.com"
});
var firebaseAuth     = admin.auth();
var firebaseDatabase = admin.database();

/**
 * logincreate：登录或者注册
 * 因为firebase包的账号注册函数只能检测错误,不具备返回uid功能。所以在这里firebase与firebase-admin混合使用。
 * firebase包用于判断登录
 * firebase-admin包用于执行账号注册
 * 处理流程:
 *      1.模拟登录
 *       1.1.账号密码验证成功, 返回uid.
 *       1.2.账号密码验证失败, 准备执行注册操作.
 *           1.2.1.如果是因为"账号未注册"为由,将执行注册操作.
 *               1.2.1.1.注册成功!返回uid.
 *               1.2.1.2.注册失败.返回错误对象.
 *           1.2.2.如果是因为其他原因导致登录失败,将返回错误对象.
 *
 * @param email: <string> 邮箱
 * @param password: <string> 密码
 * @returns 成功: {uid: 'FirebaseAuth Uid'}
 *          失败: {code: 'Error type',message:'Error Message'}
 */
exports.logincreate = functions.https.onRequest((request, response) => {
    // 登录用凭证类
    var credential = firebase.auth.EmailAuthProvider.credential(request.body.email, request.body.password);
    // 1.模拟登录
    firebase.auth().signInAndRetrieveDataWithCredential(credential)
        .then(async function(userCredential) {
            // 1.1.账号密码验证成功, 返回uid.
            var returnObj =await getFirebaseDB(userCredential.user.uid);
            response.send(returnObj);

        })
        .catch(function(error){
            // 1.2.账号密码验证失败, 准备执行注册操作.
            if(error.code =='auth/user-not-found'){
                // 1.2.1.如果是因为"账号未注册"为由,将执行注册操作.
                firebaseAuth.createUser({
                    email: request.body.email,
                    emailVerified: false,
                    // phoneNumber: "+11234567890",
                    password: request.body.password,
                    // displayName: "John Doe",
                    // photoURL: "http://www.example.com/12345678/photo.png",
                    disabled: false
                })
                .then(function(userRecord) {
                    // 1.2.1.1.注册成功!返回uid.
                    response.send({uid:userRecord.uid});
                })
                .catch(function(error) {
                    // 1.2.1.2.注册失败.返回错误对象.
                    response.send(error);
                });
            }
            else{
                // 1.2.2.如果是因为其他原因导致登录失败,将返回错误对象.
                response.send(error);
            }
        });
});

async function getFirebaseDB(uid){
    try {
        var snapshort = await firebaseDatabase.ref().child(uid).once('value');
        if(snapshort.val()){
            return snapshort.val();
        }else{
            return [];
        }

    } catch (error) {
        config.log("getFirebaseDB:",error);
        return error;
    }


}

/**
 * Firebase RealtimeDatabase Upload
 */
exports.uploadpluginlist = functions.https.onRequest((request, response) => {

    if (request.body.hasOwnProperty('uid') && request.body.hasOwnProperty('pluginlist')) {
        firebaseDatabase.ref().child(request.body.uid).set(request.body.pluginlist);
        response.send({uid:request.body.uid});
    }
    else{
        response.send({code:'data/wrong',message:'UID is not found'});
    }

});