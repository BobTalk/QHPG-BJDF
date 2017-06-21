/*
 2017年5月10日 10:08:15
 byx
 评估管理-项目管理模块route层
 * */

var express = require('express');
var router = express.Router();

var projectService = require('../../service/pgmanage_service/projectService');

// 添加项目
router.get('/saveProjectInfo', function (req, res, next) {
    projectService.saveProjectInfo(req, res, next);
});
// 保存项目任务
router.get('/saveProjectTaskInfo', function (req, res, next) {
    projectService.saveProjectTaskInfo(req, res, next);
});
// 删除任务信息
router.get('/deleteTaskInfo', function (req, res, next) {
    projectService.deleteTaskInfo(req, res, next);
});
// 修改项目状态
router.get('/setProjectState', function (req, res, next) {
    projectService.setProjectState(req, res, next);
});
// 获取项目列表
router.get('/getProjectList', function (req, res, next) {
    projectService.getProjectList(req, res, next);
});
// 获取项目详情
router.get('/getProjectInfo', function (req, res, next) {
    projectService.getProjectInfo(req, res, next);
});
module.exports = router;

