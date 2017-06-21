/*
 2017年5月17日
 hyq
 用户管理模块route层
 * */
var express = require('express');
var router = express.Router();
var classService = require('../../service/bdmanage_service/classService');
//添加用户
router.get("/addBDTaskInfo", function (req, res, next) {
    classService.saveUserInfo(req, res, next);
});
//删除用户
router.get("/removeBDTaskInfo", function (req, res, next) {
    classService.removeUserInfo(req, res, next);
});
//修改用户
router.get("/updataBDTaskInfo", function (req, res, next) {
    classService.updataUserInfo(req, res, next);
});
module.exports = router;