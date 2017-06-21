/*
 2017年4月26日 09:00:40
 byx
 进度的route层
 * */

var express = require('express');
var router = express.Router();

var scheduleService = require('../service/scheduleService');

// 获取进度
//TODO 同时支持get,post
router.get('/getSchedule', function (req, res, next) {
    scheduleService.getSchedule(req, res, next);
});

module.exports = router;

