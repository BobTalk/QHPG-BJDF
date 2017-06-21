/*
 2017年5月22日09:50:43
 hyq
 项目模块的dao层,sql语句
 * */

var Project = {
    //项目列表
    getProjectList: function (project_name, pagesize, pagenum) {
        var sql = "SELECT p.project_id,p.project_name,p.descript,p.start_time,p.end_time,p.create_time,p.state,p.create_user_id,tq.questionnaire_id,tq.questionnaire_name,t.in_role FROM project p JOIN task_questionnaire tq ON p.project_id = tq.project_id JOIN task t ON p.project_id = t.project_id";
        sql += " WHERE state != 2 ";
        if (project_name != '-1') {
            sql += "AND p.project_name LIKE '%" + project_name + "%'";
        }
        sql += " ORDER BY p.sync DESC ";
        sql += " LIMIT " + pagenum + ", " + pagesize;
        return sql;
    },
    //获取项目列表-总数
    getProjectNum: function (project_name) {
        var sql = "SELECT count(p.project_id) as project_num FROM project p  ";

        sql += " WHERE state != 2 ";
        if (project_name != '-1') {
            sql += "AND p.project_name LIKE '%" + project_name + "%'";
        }
        return sql;
    },
    //获取获取项目下的任务总数
    getTaskNum: function (project_id) {
        var sql = "SELECT COUNT(task_id) AS task_num  FROM task   ";
        sql += "where project_id = '" + project_id + "'";
        return sql;
    },
    //获取项目下的问卷总数
    getQuestionnaireNum: function (project_id) {
        var sql = "SELECT   COUNT(DISTINCT questionnaire_id) AS questionnaire_num FROM task_questionnaire   ";
        sql += "where project_id = '" + project_id + "'";
        return sql;
    },
    //获取项目下的学校总数
    getSchoolNum: function (project_id) {
        var sql = "SELECT  COUNT(DISTINCT school_id) AS school_num FROM task_grade   ";
        sql += "where project_id = '" + project_id + "'";
        return sql;
    },
    //获取学校中有project_id项目的总人数
    getSchoolUserNum:function (project_id) {
        //先查询所有学生 过滤并在同一个项目下的所有学生
        var sql = "SELECT  COUNT(school_id) AS schoolUser_num FROM bd_studentinfo bs JOIN task_grade tg    ";
        sql += "ON  tg.school_id = bs.server_id where tg.project_id = "+"'"+project_id +"'";
        return sql;
    },
    //获取项目下的学校提交人数
    getSchoolSubUserNum:function (questionnaire_id,project_id) {
        //查询所有提交人数 并根据问卷ID 和项目ID 过滤
        var sql = "SELECT  COUNT(questionnaire_id) AS getSchoolSubUserNum FROM questionnaire_submit   ";
        sql += "where questionnaire_id = '" +questionnaire_id + "' and project_id="+"'"+ project_id+ "'";
        return sql;
    },
    //获取项目基本信息
    getProjectInfo: function (project_id) {
        var sql = "SELECT 	project_id, project_name, descript, start_time, end_time, create_time, sync, create_user_id, state FROM project where project_id = '" + project_id + "' ";
        return sql;
    },
    //根据项目获取所有任务列表
    getTaskListByProject_id: function (project_id) {
        var sql = "SELECT 	task_id, task_name, descript, create_time, project_id, in_role, xueduans FROM task WHERE project_id = '" + project_id + "'  ORDER BY create_time DESC ";
        return sql;
    },
    //根据任务ID获取所有任务问卷列表
    getTaskQuestionnaireListByTask_id: function (task_id) {
        var sql = "SELECT 	id, project_id, task_id, questionnaire_id, questionnaire_name, create_time FROM task_questionnaire  WHERE task_id = '" + task_id + "' ";
        return sql;
    },
    //根据任务ID获取所有任务附件列表
    getTaskAttachmentListByTask_id: function (task_id) {
        var sql = "SELECT 	ta.*,a.use_role,a.stand_type,a.stand_type_name,a.stand_id,a.stand_name FROM task_attachment  ta JOIN attachment a ON ta.attachment_id = a.attachment_id WHERE ta.task_id = '" + task_id + "' ";
        return sql;
    },
    //根据任务ID获取所有任务量表列表
    getTaskScaleListByTask_id: function (task_id) {
        var sql = "SELECT 	ts.*,s.use_role FROM task_scale ts JOIN scale s ON ts.scale_id = s.scale_id  WHERE ts.task_id = '" + task_id + "' ";
        return sql;
    },
    //根据任务ID获取所有任务学校列表
    getTaskSchoolListByTask_id: function (task_id) {
        var sql = "SELECT g.*,sch.p_organ_id,sch.p_organ_name " +
            "FROM (SELECT school_id,school_name FROM task_grade WHERE  task_id = '" + task_id + "' GROUP BY school_id ) AS g " +
            "LEFT JOIN bd_schoolinfo sch ON g.school_id = sch.school_id ";
        return sql;
    },
    //根据任务ID获取所有任务年级列表
    getTaskGradeListByTask_id: function (task_id) {
        var sql = "SELECT grade_id,grade_name FROM task_grade  WHERE task_id = '" + task_id + "' GROUP BY grade_id";
        return sql;
    }
};
module.exports = Project;