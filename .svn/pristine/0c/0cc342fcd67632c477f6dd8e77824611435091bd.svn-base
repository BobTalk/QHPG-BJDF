/*
 2017年5月9日 16:44:33
 byx
 基础数据管理-学校模块route层
 * */

var express = require('express');
var router = express.Router();

var schoolService = require('../../service/bdmanage_service/schoolService');

// 获取学校列表
router.get('/getSchoolList', function (req, res, next) {
    schoolService.getSchoolList(req, res, next);
});

module.exports = router;

