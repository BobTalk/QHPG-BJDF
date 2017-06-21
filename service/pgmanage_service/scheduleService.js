/*
 2017年5月19日 17:53:45
 byx
 评估管理-进度管理模块的service层
 * */
var $util = require('../../util/util');
var async = require('async');
var scheduleDao = require('../../dao/pgmanage_dao/scheduleDao');

module.exports = {

    /* 学校进度
     * byx 2017-5-19 17:55:17
     * params
     * @req
     * @res
     *
     * return res.json();
     * */
    schoolListSchedule: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            var project_name = param.project_name.length == 0 ? "-1" : param.project_name;
            // 分页
            var pagesize = param.page_size;
            var pagenum = param.page_num;
            pagenum = (pagenum - 1) * pagesize;
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        var projectList = [];
        //1、获取项目列表
        projectDao.getProjectList(project_name, pagesize, pagenum, function (err, result) {
            if (err != null) {
                $util.resJSONError(err, res);
                return;
            }
            projectList = result;
            var index = 0;
            //2、循环项目列表获取项目任务数量、问卷数量、学校数量
            async.eachSeries(projectList, function (item, callback) {
                projectDao.getProjectRltNum(item.project_id, function (errProRlt, resultProRlt) {
                    if (errProRlt != null) {
                        $util.resJSONError(errProRlt, res);
                        return;
                    }
                    projectList[index].task_num = resultProRlt[0][0].task_num;
                    projectList[index].questionnaire_num = resultProRlt[1][0].questionnaire_num;
                    projectList[index].school_num = resultProRlt[2][0].school_num;
                    index++;
                    // 执行完成后也要调用callback，不需要参数
                    callback();
                });
            }, function (errPro) {
                // 所有执行完成后回调
                if (errPro) {
                    $util.resJSONError(errPro, res);
                    return;
                } else {
                    //获取项目总数
                    projectDao.getProjectNum(project_name, function (errRows, resultRows) {
                        if (errRows) {
                            $util.resJSONError(errRows, res);
                            return;
                        }
                        $util.resJSON.resultnum = $util.resConfig.ok;
                        $util.resJSON.resultdata = projectList;
                        $util.resJSON.rows = resultRows[0].project_num;
                        res.json($util.resJSON);
                    })
                }
            });
        });
    }

};
