/*
 2017年5月17日
 hyq
 教师模块route层
 * */
var express = require('express');
var router = express.Router();
var teacherService = require('../../service/bdmanage_service/teacherService');
router.get("/addBDTaskInfo",function (req, res, next) {
    teacherService.saveTeacherInfo(req, res, next);
});
router.get("/removeBDTaskInfo",function (req, res, next) {
    teacherService.removeTeacherInfo(req, res, next);
});
router.get("/updataBDTaskInfo",function (req, res, next) {
    teacherService.updataTeacherInfo(req, res, next);
});
module.exports = router;