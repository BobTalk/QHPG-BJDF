/**
 * Created by byx on 17/5/16.
 * 问卷填报模块 业务处理层
 */
var $util = require('../../util/util');

var questionnaireDao = require('../../dao/client_dao/questionnaireDao');

module.exports = {
    //问卷填报
    saveAnswer: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var answerInfo = {};
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            answerInfo.answer_id = param.answer_id.length == 0 ? $util.GUID() : param.answer_id;
            answerInfo.user_id = param.user_id;
            answerInfo.server_id = param.server_id;
            answerInfo.user_role = param.user_role;
            answerInfo.project_id = param.project_id;
            answerInfo.task_id = param.task_id;
            answerInfo.questionnaire_id = param.questionnaire_id;
            answerInfo.content = param.content;
            answerInfo.page_num = param.page_num;
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        questionnaireDao.saveAnswer(answerInfo, function (err, result) {
            if (err != null) {
                $util.resJSONError(err, res);
                return;
            }
            $util.resJSON.resultnum = $util.resConfig.ok;
            $util.resJSON.resultdata = {answer_id: answerInfo.answer_id};
            res.json($util.resJSON);
        });
    },
    //获取问卷答案
    getQuestionnaireAnswer: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var answerInfo = {};
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            answerInfo.project_id = param.project_id;
            answerInfo.task_id = param.task_id;
            answerInfo.questionnaire_id = param.questionnaire_id;
            answerInfo.page_num = param.page_num;
            answerInfo.user_id = param.user_id;
            answerInfo.server_id = param.server_id;
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }

        questionnaireDao.getQuestionnaireAnswer(answerInfo, function (err, result) {
            if (err != null) {
                $util.resJSONError(err, res);
                return;
            }
            $util.resJSON.resultnum = $util.resConfig.ok;
            $util.resJSON.resultdata = result;
            res.json($util.resJSON);
        });
    },

    //提交问卷
    submitQuestionnaire: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var answerInfo = {};
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            answerInfo.server_id = param.server_id;
            answerInfo.user_id = param.user_id;
            answerInfo.project_id = param.project_id;
            answerInfo.task_id = param.task_id;
            answerInfo.questionnaire_id = param.questionnaire_id;
            answerInfo.answer_items = param.answer_items;
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        questionnaireDao.submitQuestionnaire(answerInfo, function (err, result) {
            if (err != null) {
                $util.resJSONError(err, res);
                return;
            }
            $util.resJSON.resultnum = $util.resConfig.ok;
            $util.resJSON.resultdata = {sub_id: result[0].insertId};
            res.json($util.resJSON);
        });
    },

    //获取我的问卷列表接口[不同状态、不同角色查看问卷数量和操作权限不同]
    getQuestionnaireList: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var userInfo = {};
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            userInfo.user_id = param.user_id;
            userInfo.server_id = param.server_id;
            userInfo.user_role = param.user_role;
            userInfo.grade_id = param.grade_id;
            userInfo.grade_name = param.grade_name;
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }

        switch (userInfo.user_role) {
            case"学生":
            case"家长":
            case"教师":
                questionnaireDao.getQuestoinnaireList_noLeader(userInfo, function (err, result) {
                    if (err != null) {
                        $util.resJSONError(err, res);
                        return;
                    }
                    $util.resJSON.resultnum = $util.resConfig.ok;
                    $util.resJSON.resultdata = result;
                    res.json($util.resJSON);
                });
                break;
            case"校长":
                questionnaireDao.getQuestoinnaireList_schoolLeader(userInfo, function (err, result) {
                    if (err != null) {
                        $util.resJSONError(err, res);
                        return;
                    }
                    $util.resJSON.resultnum = $util.resConfig.ok;
                    $util.resJSON.resultdata = result;
                    res.json($util.resJSON);
                });
                break;
            case"教育局人员":
            case"教管中心人员":
                //先后获取机构下的学校
                //再获取学校下的问卷
                questionnaireDao.getQuestoinnaireList_schoolLeader(userInfo, function (err, result) {
                    if (err != null) {
                        $util.resJSONError(err, res);
                        return;
                    }
                    $util.resJSON.resultnum = $util.resConfig.ok;
                    $util.resJSON.resultdata = result;
                    res.json($util.resJSON);
                });
                break;
            default:
                $util.resJSON.resultnum = $util.resConfig.fail;
                res.json($util.resJSON);
                break;
        }


    },
};
 