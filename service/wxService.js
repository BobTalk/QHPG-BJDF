// dao/wxService.js
// 实现微信业务处理，分离route和数据库
var $util = require('../util/util');
var weixinApi = require('weixin-api');

// 日志
var logHelp = require("../libs/logHelper");
module.exports = {
    //微信发送的Token验证,返回加密后的echostr，方可验证成功
    checkToken: function (req, res, next) {
        logHelp.writeInfo("接收到微信的请求");
        // 签名成功
        if (weixinApi.checkSignature(req)) {
            res.status(200).send(req.query.echostr);
        } else {
            res.status(200).send('fail');
        }
    },

    // 用来接收用户消息和给用户返回消息的接口
    /*比如说关注者的微信发过来一个“1”，其实这个请求首先是发送给了微信的服务器，
     然后微信服务器再通过post请求转发到我们的后台，我们后台再组织数据给微信后台，最后返回给关注者用户。*/
    postUser: function (req, res, next) {
        var response = res;
        var formData = "";
        req.on("data", function (data) {
            formData += data;
        });
        req.on("end", function () {
            processMessage.processMessage(formData, response);
        });
    }

};
