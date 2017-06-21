/*
 2017年4月15日 16:49:31
 byx
 基础数据的route层
 * */

var express = require('express');
var router = express.Router();

var dataBaseService = require('../service/baseDataService');

// 用户登录
//TODO 同时支持get,post
router.get('/UserLogin', function (req, res, next) {
    dataBaseService.UserLogin(req, res, next);
});

module.exports = router;

