/*
 2017年5月17日
 hyq
 用户管理模块route层
 * */
var express = require('express');
var router = express.Router();
var gradeService = require('../../service/bdmanage_service/gradeService');
//添加用户
router.get("/addBDTaskInfo", function (req, res, next) {
    gradeService.saveUserInfo(req, res, next);
});
//删除用户
router.get("/removeBDTaskInfo", function (req, res, next) {
    gradeService.removeUserInfo(req, res, next);
});
//修改用户
router.get("/updataBDTaskInfo", function (req, res, next) {
    gradeService.updataUserInfo(req, res, next);
});
module.exports = router;