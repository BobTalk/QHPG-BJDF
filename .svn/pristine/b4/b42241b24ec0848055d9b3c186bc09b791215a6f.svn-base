/*
 2017年5月17日
 hyq
 用户管理模块route层
 * */
var express = require('express');
var router = express.Router();
var studentService = require('../../service/bdmanage_service/studentService');
//添加
router.get("/addBDTaskInfo", function (req, res, next) {
    studentService.saveUserInfo(req, res, next);
});
//删除
router.get("/removeBDTaskInfo", function (req, res, next) {
    studentService.removeUserInfo(req, res, next);
});
//修改
router.get("/updataBDTaskInfo", function (req, res, next) {
    studentService.updataUserInfo(req, res, next);
});
module.exports = router;