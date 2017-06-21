/**
 * Created by sanghuina on 17/5/9.
 * 举报模块路由
 */
var express = require('express');
var router = express.Router();

var tipoffService = require('../../service/client_service/tipoffService');

/*获取举报列表*/
router.get('/getTipoffList', function (req, res, next) {
    tipoffService.getTipoffList(req, res, next);
});
/*保存举报信息*/
router.get('/saveTipoff', function (req, res, next) {
    tipoffService.saveTipoff(req, res, next);
});
/* 删除举报信息*/
router.get('/deleteTipoff', function (req, res, next) {
    tipoffService.deleteTipoff(req, res, next);
});
/*获取举报详情*/
router.get('/getTipoffInfo', function (req, res, next) {
    tipoffService.getTipoffInfo(req, res, next);
});
 /*修改举报状态*/
router.get('/updatetipState', function (req, res, next) {
    tipoffService.updatetipState(req, res, next);
});
/* 举报审批通过*/
router.get('/examinetipoff', function (req, res, next) {
    tipoffService.examinetipoff(req, res, next);
});
module.exports = router;