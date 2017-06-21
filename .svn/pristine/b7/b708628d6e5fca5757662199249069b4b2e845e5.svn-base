/*
 2017年5月17日
 hyq
 用户管理模块route层
 * */
var express = require('express');
var router = express.Router();
var parentService = require('../../service/bdmanage_service/parentService');
//添加用户
router.get("/addBDTaskInfo", function (req, res, next) {
    parentService.saveUserInfo(req, res, next);
});
//删除用户
router.get("/removeBDTaskInfo", function (req, res, next) {
    parentService.removeUserInfo(req, res, next);
});
//修改用户
router.get("/updataBDTaskInfo", function (req, res, next) {
    parentService.updataUserInfo(req, res, next);
});
module.exports = router;