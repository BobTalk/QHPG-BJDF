var express = require('express');
var router = express.Router();

var wxService = require('../service/wxService');


// 微信发送的Token验证
router.get('/checkToken', function (req, res, next) {
    wxService.checkToken(req, res, next);
});

// 用来接收用户消息和给用户返回消息的接口
router.post('/', function (req, res) {
    wxService.postUser(req, res, next);
});

module.exports = router;

