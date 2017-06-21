/*
 2017年5月10日 13:48:31
 byx
 评估管理-项目管理模块的dao层,sql语句
 * */

var Questionnaire = {
    //保存项目信息
    saveProjectInfo: function (projectInfo) {
        var sql = "INSERT INTO project (project_id, project_name, descript, start_time, end_time, sync, create_user_id, state) "
            + "VALUES ('"
            + projectInfo.project_id + "', '"
            + projectInfo.project_name + "', '"
            + projectInfo.descript + "', '"
            + projectInfo.start_time + "', '"
            + projectInfo.end_time + "',  '"
            + projectInfo.sync + "', '"
            + projectInfo.create_user_id + "', '"
            + projectInfo.state + "') "
            + " ON DUPLICATE KEY UPDATE " +
            "project_name = '" + projectInfo.project_name
            + "',descript = '" + projectInfo.descript
            + "',start_time = '" + projectInfo.start_time
            + "',end_time = '" + projectInfo.end_time
            + "',sync = '" + projectInfo.sync
            + "',create_user_id = '" + projectInfo.create_user_id
            + "',state = '" + projectInfo.state + "';"
        return sql;
    },
    //保存项目信息
    saveTaskInfo: function (projectTaskInfo) {
        var sql = "INSERT INTO task (task_id, task_name, descript, project_id, in_role, xueduans) "
            + "VALUES ('"
            + projectTaskInfo.task_item.task_id + "', '"
            + projectTaskInfo.task_item.task_name + "', '"
            + projectTaskInfo.task_item.description + "', '"
            + projectTaskInfo.project_id + "', '"
            + projectTaskInfo.task_item.in_role + "',  '"
            + projectTaskInfo.task_item.task_xueduans + "') "
            + " ON DUPLICATE KEY UPDATE " +
            "task_name = '" + projectTaskInfo.task_item.task_name
            + "',descript = '" + projectTaskInfo.task_item.description
            + "',project_id = '" + projectTaskInfo.project_id
            + "',in_role = '" + projectTaskInfo.task_item.in_role
            + "',xueduans = '" + projectTaskInfo.task_item.task_xueduans + "';"
        return sql;
    },
    //保存项目年级信息
    saveTaskGrade: function (task_grade_item) {
        var arrTaskGrade = [];
        arrTaskGrade = task_grade_item;
        var arrLength = arrTaskGrade.length;
        var sql = "";
        sql += "INSERT INTO task_grade (project_id, task_id, school_id, school_name, grade_id, grade_name, in_role) "
            + "VALUES ";
        arrTaskGrade.forEach(function (item, index) {
            sql += "('"
                + item.project_id + "', '"
                + item.task_id + "', '"
                + item.school_id + "', '"
                + item.school_name + "', '"
                + item.grade_id + "',  '"
                + item.grade_name + "',  '"
                + item.in_role + "') ";
            if ((index + 1) < arrLength) {
                sql += ",";
            }
        })
        return sql;
    },
    //保存项目问卷信息
    saveTaskQuestionnaire: function (task_questionnaire_item) {
        var arrTaskQ = [];
        arrTaskQ = task_questionnaire_item;
        var arrLength = arrTaskQ.length;
        var sql = "INSERT INTO task_questionnaire (project_id, task_id, questionnaire_id, questionnaire_name) "
            + "VALUES ";
        arrTaskQ.forEach(function (item, index) {
            sql += "('"
                + item.project_id + "', '"
                + item.task_id + "', '"
                + item.questionnaire_id + "', '"
                + item.questionnaire_name + "') ";
            if ((index + 1) < arrLength) {
                sql += ",";
            }
        })
        return sql;
    },
    //保存项目量表信息
    saveTaskScale: function (task_scale_item) {
        var arrTaskScale = [];
        arrTaskScale = task_scale_item;
        var arrLength = arrTaskScale.length;
        var sql = "INSERT INTO task_scale (project_id, task_id, scale_id, scale_name) "
            + "VALUES ";
        arrTaskScale.forEach(function (item, index) {
            sql += "('"
                + item.project_id + "', '"
                + item.task_id + "', '"
                + item.scale_id + "', '"
                + item.scale_name + "') ";
            if ((index + 1) < arrLength) {
                sql += ",";
            }
        })
        return sql;
    },
    //保存项目附件信息
    saveTaskAttachMent: function (task_attachment_item) {
        var arrTaskAtt = [];
        arrTaskAtt = task_attachment_item;
        var arrLength = arrTaskAtt.length;
        var sql = "INSERT INTO task_attachment (project_id, task_id, attachment_id, attachment_name) "
            + "VALUES ";
        arrTaskAtt.forEach(function (item, index) {
            sql += "('"
                + item.project_id + "', '"
                + item.task_id + "', '"
                + item.attachment_id + "', '"
                + item.attachment_name + "') ";
            if ((index + 1) < arrLength) {
                sql += ",";
            }
        })
        return sql;
    },


    //删除项目任务信息
    deleteTaskInfo: function (project_id, task_id) {
        var sql = "DELETE FROM task WHERE project_id='" + project_id + "' AND task_id = '" + task_id + "';  ";
        return sql;
    },
    //删除项目年级信息
    deleteTaskGrade: function (project_id, task_id) {
        var sql = "DELETE FROM task_grade WHERE project_id='" + project_id + "' AND task_id = '" + task_id + "';  ";
        return sql;
    },
    //删除项目问卷信息
    deleteTaskQuestionnaire: function (project_id, task_id) {
        var sql = "DELETE FROM task_questionnaire WHERE project_id='" + project_id + "' AND task_id = '" + task_id + "';  ";
        return sql;
    },
    //删除项目量表信息
    deleteTaskScale: function (project_id, task_id) {
        var sql = "DELETE FROM task_scale WHERE project_id='" + project_id + "' AND task_id = '" + task_id + "';  ";
        return sql;
    },
    //删除项目附件信息
    deleteTaskAttachment: function (project_id, task_id) {
        var sql = "DELETE FROM task_attachment WHERE project_id='" + project_id + "' AND task_id = '" + task_id + "';  ";
        return sql;
    },


    //修改项目状态
    setProjectState: function (projectInfo) {
        var sql = "UPDATE project SET  state = '" + projectInfo.state + "' WHERE project_id = '" + projectInfo.project_id + "' ; ";
        return sql;
    },


    //获取项目列表
    getProjectList: function (project_name, pagesize, pagenum) {
        var sql = "SELECT p.project_id,p.project_name,p.descript,p.start_time,p.end_time,p.create_time,p.state,p.create_user_id FROM project p  ";

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
    //获取获取项目下的问卷总数
    getQuestionnaireNum: function (project_id) {
        var sql = "SELECT   COUNT(DISTINCT questionnaire_id) AS questionnaire_num FROM task_questionnaire   ";
        sql += "where project_id = '" + project_id + "'";
        return sql;
    },
    //获取获取项目下的学校总数
    getSchoolNum: function (project_id) {
        var sql = "SELECT   COUNT(DISTINCT school_id) AS school_num FROM task_grade   ";
        sql += "where project_id = '" + project_id + "'";
        return sql;
    },
    //获取项目列表
    //getProjectTaskNum: function (project_id, pagesize, pagenum) {
    //    var sql = "SELECT p.project_id,p.project_name,p.descript,p.start_time,p.end_time,p.create_time,p.state,p.create_user_id,COUNT(t.task_id) AS task_num,tg.school_num,tq.questionnaire_num FROM project p  ";
    //    sql += "JOIN task t ON p.project_id=t.project_id ";
    //    sql += "JOIN (SELECT COUNT(DISTINCT school_id) AS school_num,project_id FROM task_grade GROUP BY project_id) tg ON p.project_id = tg.project_id ";
    //    sql += "JOIN (SELECT COUNT(DISTINCT questionnaire_id) AS questionnaire_num,project_id FROM task_questionnaire GROUP BY project_id) tq ON p.project_id = tq.project_id ";
    //    sql += " WHERE state != 2 ";
    //    if (project_name != '-1') {
    //        sql += "AND p.project_name LIKE '%" + project_name + "%'";
    //    }
    //    sql += " GROUP BY p.project_id"
    //    sql += " ORDER BY p.sync DESC ";
    //    sql += " LIMIT " + pagenum + ", " + pagesize;
    //    return sql;
    //},
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

module.exports = Questionnaire;