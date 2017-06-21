/*
 2017年5月10日 10:08:15
 byx
 评估管理-量表模块route层
 * */

var express = require('express');
var router = express.Router();

var scaleService = require('../../service/pgmanage_service/scaleService');

// 获取量表列表
router.get('/getScaleList', function (req, res, next) {
    scaleService.getScaleList(req, res, next);
});

module.exports = router;

