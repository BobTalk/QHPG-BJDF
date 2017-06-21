/*
 2017年5月9日 16:44:33
 byx
 基础数据管理-机构模块route层
 * */

var express = require('express');
var router = express.Router();

var organService = require('../../service/bdmanage_service/organService');

// 获取学校列表
router.get('/getOrganList', function (req, res, next) {
    organService.getOrganList(req, res, next);
});

module.exports = router;

