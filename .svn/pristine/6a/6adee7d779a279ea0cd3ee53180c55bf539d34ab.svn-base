/*
 2017年5月19日 17:52:00
 byx
 评估管理-进度管理模块route层
 * */

var express = require('express');
var router = express.Router();

var scheduleService = require('../../service/pgmanage_service/scheduleService');

// 获取项目进度
router.get('/projectSchedule', function (req, res, next) {
    scheduleService.projectSchedule(req, res, next);
});
// 获取教研中心进度
router.get('/organSchedule', function (req, res, next) {
    scheduleService.organSchedule(req, res, next);
});
// 学校进度
router.get('/schoolListSchedule', function (req, res, next) {
    scheduleService.schoolListSchedule(req, res, next);
});
// 学校进度详情
router.get('/schoolSchedule', function (req, res, next) {
    scheduleService.schoolSchedule(req, res, next);
});
// 年级进度
router.get('/gradeSchedule', function (req, res, next) {
    scheduleService.gradeSchedule(req, res, next);
});
// 班级进度
router.get('/classSchedule', function (req, res, next) {
    scheduleService.classSchedule(req, res, next);
});
module.exports = router;

