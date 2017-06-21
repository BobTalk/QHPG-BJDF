/*
 2017年5月10日 13:46:53
 byx
 评估管理-项目管理模块的dao层
 * */

var $sql = require('./projectSqlMapping');
var $mysqlUtil = require('../../util/mysqlUtil');

module.exports = {
    //保存项目信息
    saveProjectInfo: function (projectInfo, callback) {
        var sql = $sql.saveProjectInfo(projectInfo);
        $mysqlUtil.queryStrSql(sql, callback);
    },
    //保存任务基本信息
    saveTaskInfo: function (projectTaskInfo, callback) {
        var sql = $sql.saveTaskInfo(projectTaskInfo);
        $mysqlUtil.queryStrSql(sql, callback);
    },
    //保存项目年级信息
    saveTaskGrade: function (task_grade_item, callback) {
        //如果集合为空，不执行sql，直接回调
        if (task_grade_item.length == 0) {
            callback(null);
            return;
        }
        var sqls = [];
        sqls.push($sql.deleteTaskGrade(task_grade_item[0].project_id, task_grade_item[0].task_id));
        sqls.push($sql.saveTaskGrade(task_grade_item));
        $mysqlUtil.queryArrSql(sqls, callback);
    },
    //保存项目问卷信息
    saveTaskQuestionnaire: function (task_questionnaire_items, callback) {
        //如果集合为空，不执行sql，直接回调
        if (task_questionnaire_items.length == 0) {
            callback(null);
            return;
        }
        var sqls = [];
        sqls.push($sql.deleteTaskQuestionnaire(task_questionnaire_items[0].project_id, task_questionnaire_items[0].task_id));
        sqls.push($sql.saveTaskQuestionnaire(task_questionnaire_items));
        $mysqlUtil.queryArrSql(sqls, callback);
    },
    //保存项目量表信息
    saveTaskScale: function (task_scale_items, callback) {
        //如果集合为空，不执行sql，直接回调
        if (task_scale_items.length == 0) {
            callback(null);
            return;
        }
        var sqls = [];
        sqls.push($sql.deleteTaskScale(task_scale_items[0].project_id, task_scale_items[0].task_id));
        sqls.push($sql.saveTaskScale(task_scale_items));
        $mysqlUtil.queryArrSql(sqls, callback);
    },
    //保存项目附件信息
    saveTaskAttachMent: function (task_attachment_item, callback) {
        //如果集合为空，不执行sql，直接回调
        if (task_attachment_item.length == 0) {
            callback(null);
            return;
        }
        var sqls = [];
        sqls.push($sql.deleteTaskAttachment(task_attachment_item[0].project_id, task_attachment_item[0].task_id));
        sqls.push($sql.saveTaskAttachMent(task_attachment_item));
        $mysqlUtil.queryArrSql(sqls, callback);
    },


    /* 删除任务信息
     * byx 2017-5-11 14:45:47
     * params
     * @project_id  项目ID
     * @task_id 任务ID
     *
     * return callback();
     * */
    deleteTaskInfo: function (project_id, task_id, callback) {
        var sqls = [];
        sqls.push($sql.deleteTaskInfo(project_id, task_id));
        sqls.push($sql.deleteTaskGrade(project_id, task_id));
        sqls.push($sql.deleteTaskQuestionnaire(project_id, task_id));
        sqls.push($sql.deleteTaskScale(project_id, task_id));
        sqls.push($sql.deleteTaskAttachment(project_id, task_id));
        $mysqlUtil.queryArrSql(sqls, callback);
    },


    //修改项目状态
    setProjectState: function (projectInfo, callback) {
        var sql = $sql.setProjectState(projectInfo);
        $mysqlUtil.queryStrSql(sql, callback);
    },


    /* 获取项目列表
     * byx 2017-5-11 14:45:47
     * params
     * @project_name
     *
     * return projectList;
     * */
    getProjectList: function (project_name, pagesize, pagenum, callback) {
        var sql = $sql.getProjectList(project_name, pagesize, pagenum);
        $mysqlUtil.queryStrSql(sql, callback);
    },
    /* 获取项目列表-总数
     * byx 2017-5-11 14:45:47
     * params
     * @project_name
     *
     * return projectNum;
     * */
    getProjectNum: function (project_name, callback) {
        var sql = $sql.getProjectNum(project_name);
        $mysqlUtil.queryStrSql(sql, callback);
    },
    /* 获取获取项目下的学校总数
     * byx 2017-5-11 14:45:47
     * params
     * @project_id
     *
     * return schoolNum;
     * */
    getSchoolNum: function (project_id, pagesize, pagenum, callback) {
        var sql = $sql.getSchoolNum(project_id);
        $mysqlUtil.queryStrSql(sql, callback);
    },
    /* 获取项目基本详情
     * byx 2017-5-11 14:45:47
     * params
     * @project_id
     *
     * return projectInfo;
     * */
    getProjectInfo: function (project_id, callback) {
        var sql = $sql.getProjectInfo(project_id);
        $mysqlUtil.queryStrSql(sql, callback);
    },
    /* 根据项目获取所有任务列表
     * byx 2017-5-11 14:45:47
     * params
     * @project_id
     *
     * return projectInfo;
     * */
    getTaskListByProject_id: function (project_id, callback) {
        var sql = $sql.getTaskListByProject_id(project_id);
        $mysqlUtil.queryStrSql(sql, callback);
    },
    /* 根据项目获取所有任务关联0学校、1年级、2问卷、3量表、4附件列表
     * byx 2017-5-11 14:45:47
     * params
     * @task_id
     *
     * return projectInfo;
     * */
    getTaskRltListByTask_id: function (task_id, callback) {
        var sqls = [];
        sqls.push($sql.getTaskSchoolListByTask_id(task_id));
        sqls.push($sql.getTaskGradeListByTask_id(task_id));
        sqls.push($sql.getTaskQuestionnaireListByTask_id(task_id));
        sqls.push($sql.getTaskScaleListByTask_id(task_id));
        sqls.push($sql.getTaskAttachmentListByTask_id(task_id));
        $mysqlUtil.queryArrSql(sqls, callback);
    },
    /* 根据项目获取所有任务关联0学校、1年级、2问卷、3量表、4附件 总数
     * byx 2017-5-11 14:45:47
     * params
     * @project_id
     *
     * return projectInfo;
     * */
    getProjectRltNum: function (project_id, callback) {
        var sqls = [];
        sqls.push($sql.getTaskNum(project_id));
        sqls.push($sql.getQuestionnaireNum(project_id));
        sqls.push($sql.getSchoolNum(project_id));
        $mysqlUtil.queryArrSql(sqls, callback);
    }

};
