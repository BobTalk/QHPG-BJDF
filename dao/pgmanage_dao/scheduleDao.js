/*
 2017年5月10日 13:46:53
 byx
 评估管理-项目管理模块的dao层
 * */

var $sql = require('./scheduleSqlMapping');
var $mysqlUtil = require('../../util/mysqlUtil');

module.exports = {
    /* 获取项目列表
     * byx 2017-5-11 14:45:47
     * params
     * @project_name
     *
     * return projectList;
     * */
    getProjectList: function (project_name, pagesize, pagenum, use_role, service_id, callback) {
        var sql = $sql.getProjectList(project_name, pagesize, pagenum, use_role, service_id);
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
    /* 获取项目下的学校总数
     * */
    getSchoolNum: function (project_id, pagesize, pagenum, callback) {
        var sql = $sql.getSchoolNum(project_id);
        $mysqlUtil.queryStrSql(sql, callback);
    },
    /* 获取项目基本详情
     * */
    getProjectInfo: function (project_id, callback) {
        var sql = $sql.getProjectInfo(project_id);
        $mysqlUtil.queryStrSql(sql, callback);
    },
    /* 根据项目获取所有任务列表
     * */
    getTaskListByProject_id: function (project_id, callback) {
        var sql = $sql.getTaskListByProject_id(project_id);
        $mysqlUtil.queryStrSql(sql, callback);
    },

    getTaskRltListByTask_id: function (task_id, callback) {
        var sqls = [];
        //根据任务ID查找到学校
        sqls.push($sql.getTaskSchoolListByTask_id(task_id));
        //根据任务ID查找到年级
        sqls.push($sql.getTaskGradeListByTask_id(task_id));
        //根据任务ID查找到问卷
        sqls.push($sql.getTaskQuestionnaireListByTask_id(task_id));
        //根据任务ID获取所有任务量表列表
        sqls.push($sql.getTaskScaleListByTask_id(task_id));
        //根据任务ID查找附件列表
        sqls.push($sql.getTaskAttachmentListByTask_id(task_id));
        $mysqlUtil.queryArrSql(sqls, callback);
    },
    /* 根据项目获取所有任务关联0学校、1年级、2问卷、3量表、4附件 总数
     * */
    getProjectRltNum: function (project_id, questionnaire_id, callback) {
        var sqls = [];
        //获取项目下的任务总数
        sqls.push($sql.getTaskNum(project_id));
        //获取项目下的问卷总数
        sqls.push($sql.getQuestionnaireNum(project_id));
        //获取项目下的学校总数
        sqls.push($sql.getSchoolNum(project_id));
        //获取项目下的学校总人数
        sqls.push($sql.getSchoolUserNum(project_id));
        //获取项目下的学校提交人数
        sqls.push($sql.getSchoolSubUserNum(questionnaire_id, project_id));
        $mysqlUtil.queryArrSql(sqls, callback);
    }
};
