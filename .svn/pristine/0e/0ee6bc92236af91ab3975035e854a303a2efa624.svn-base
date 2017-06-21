/**
 * Created by byx on 17/5/16.
 * 问卷填报模块路由
 */
var express = require('express');
var router = express.Router();

var questionnaireService = require('../../service/client_service/questionnaireService');

// 问卷填报
router.get('/saveAnswer', function (req, res, next) {
    questionnaireService.saveAnswer(req, res, next);
});
// 获取问卷答案
router.get('/getQuestionnaireAnswer', function (req, res, next) {
    questionnaireService.getQuestionnaireAnswer(req, res, next);
});
// 提交问卷
router.get('/submitQuestionnaire', function (req, res, next) {
    questionnaireService.submitQuestionnaire(req, res, next);
});
// 获取我的问卷列表接口[不同状态、不同角色查看问卷数量和操作权限不同]
router.get('/getQuestionnaireList', function (req, res, next) {
    questionnaireService.getQuestionnaireList(req, res, next);
});

module.exports = router;