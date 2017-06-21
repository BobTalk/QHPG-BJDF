/*
 2017年5月10日 11:54:31
 byx
 评估管理-项目管理模块的service层
 * */
var $util = require('../../util/util');
var async = require('async');
var projectDao = require('../../dao/pgmanage_dao/projectDao');

module.exports = {
    //保存项目
    saveProjectInfo: function (req, res, next) {
        var projectInfo = {
            project_id: "",
            project_name: "",
            descript: "",
            start_time: "",
            end_time: "",
            sync: "",
            create_user_id: "",
            state: ""
        };
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            projectInfo.project_id = param.project_id.length == 0 ? $util.GUID() : param.project_id;
            projectInfo.project_name = param.project_name;
            projectInfo.descript = param.descript;
            projectInfo.start_time = param.start_time;
            projectInfo.end_time = param.end_time;
            projectInfo.create_user_id = param.create_user_id;
            projectInfo.sync = $util.getDateTime();
            projectInfo.state = "0";
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        projectDao.saveProjectInfo(projectInfo, function (err, result) {
            try {
                if (err != null) {
                    $util.resJSONError(err, res);
                    return;
                }
                $util.resJSON.resultnum = $util.resConfig.ok;
                $util.resJSON.resultdata = {project_id: projectInfo.project_id};
                res.json($util.resJSON);
            }
            catch (error) {
                $util.resJSONError(error, res);
            }
        });

    },
    //保存项目任务
    saveProjectTaskInfo: function (req, res, next) {
        var projectTaskInfo = {};
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            projectTaskInfo = JSON.parse(param.JSONPARAM);
            projectTaskInfo.task_item.task_id = projectTaskInfo.task_item.task_id.length == 0 ? $util.GUID() : projectTaskInfo.task_item.task_id;

            //处理方便入库的项目任务集合
            var taskArray = makeTaskArray(projectTaskInfo);
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        // 创建任务一共插入5张数据表【任务、任务年级、任务问卷、任务量表、任务附件】
        // 回调函数一共5层
        // 1、第一步：保存任务基本信息，
        projectDao.saveTaskInfo(projectTaskInfo, function (errTask, resultTask) {
                try {
                    if (errTask != null) {
                        $util.resJSONError(errTask, res);
                        return;
                    }

                    // 2、保存任务年级信息[保存之前先删除]
                    projectDao.saveTaskGrade(taskArray.task_grade_items, function (errTaskGrade, resultTaskGrade) {
                        if (errTaskGrade != null) {
                            $util.resJSONError(errTaskGrade, res);
                            return;
                        }

                        // 3、保存任务问卷信息[保存之前先删除]
                        projectDao.saveTaskQuestionnaire(taskArray.task_questionnaire_items, function (errTaskQ, resultTaskQ) {
                            if (errTaskQ != null) {
                                $util.resJSONError(errTaskQ, res);
                                return;
                            }

                            // 4、保存任务量表信息[保存之前先删除]
                            projectDao.saveTaskScale(taskArray.task_scale_items, function (errTaskScale, resultTaskScale) {
                                if (errTaskScale != null) {
                                    $util.resJSONError(errTaskScale, res);
                                    return;
                                }

                                // 5、保存任务附件信息[保存之前先删除]
                                projectDao.saveTaskAttachMent(taskArray.task_attachment_items, function (errTaskAtt, resultTaskAtt) {
                                    if (errTaskAtt != null) {
                                        $util.resJSONError(errTaskAtt, res);
                                        return;
                                    }

                                    $util.resJSON.resultnum = $util.resConfig.ok;
                                    $util.resJSON.resultdata = {
                                        project_id: projectTaskInfo.project_id,
                                        task_id: projectTaskInfo.task_item.task_id
                                    };
                                    res.json($util.resJSON);
                                })
                            })
                        })
                    })
                }
                catch (error) {
                    $util.resJSONError(error, res);
                }
            }
        );

    },


    /* 删除任务信息
     * byx 2017-5-11 14:45:47
     * params
     * @req
     * @res
     *
     * return res.json();
     * */
    deleteTaskInfo: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            var project_id = param.project_id;
            var task_id = param.task_id;
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        projectDao.deleteTaskInfo(project_id, task_id, function (err, result) {
            try {
                if (err != null) {
                    $util.resJSONError(err, res);
                    return;
                }
                $util.resJSON.resultnum = $util.resConfig.ok;
                $util.resJSON.resultdata = result;
                res.json($util.resJSON);
            }
            catch (error) {
                $util.resJSONError(error, res);
            }
        });

    },


    //修改项目状态
    setProjectState: function (req, res, next) {
        var projectInfo = {
            project_id: "",
            state: ""
        };
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            projectInfo.project_id = param.project_id;
            projectInfo.state = param.state;
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        projectDao.setProjectState(projectInfo, function (err, result) {
            try {
                if (err != null) {
                    $util.resJSONError(err, res);
                    return;
                }
                $util.resJSON.resultnum = $util.resConfig.ok;
                $util.resJSON.resultdata = result;
                res.json($util.resJSON);
            }
            catch (error) {
                $util.resJSONError(error, res);
            }
        });

    },


    /* 获取项目详情
     * byx 2017-5-11 14:45:47
     * params
     * @req
     * @res
     *
     * return res.json();
     * */
    getProjectInfo: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            var project_id = param.project_id;
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        var projectInfo = {};

        //1、获取基本信息
        projectDao.getProjectInfo(project_id, function (errProject, resultProject) {
            try {
                if (errProject != null) {
                    $util.resJSONError(errProject, res);
                    return;
                }
                if (resultProject.length == 0) {
                    $util.resJSONError(errProject, res, "没有找到该项目");
                    return;
                }
                projectInfo = resultProject[0];
                //2、获取项目所有任务信息
                projectDao.getTaskListByProject_id(project_id, function (errTask, resultTask) {
                    if (errTask != null) {
                        $util.resJSONError(errTask, res);
                        return;
                    }
                    projectInfo.task_items = resultTask;
                    //3、循环 获取项目所有任务关联0学校、1年级、2问卷、3量表、4附件列表
                    var index = 0;
                    //async.eachSeries保证了的执行顺序，而且当其中一条执行异常，就不会继续执行下一条
                    async.eachSeries(projectInfo.task_items, function (item, callback) {
                        projectDao.getTaskRltListByTask_id(item.task_id, function (errTaskRlt, resultTaskRlt) {
                            if (errTaskRlt != null) {
                                $util.resJSONError(errTaskRlt, res);
                                return;
                            }
                            projectInfo.task_items[index].task_school_items = resultTaskRlt[0];
                            projectInfo.task_items[index].task_grade_items = resultTaskRlt[1];
                            projectInfo.task_items[index].task_questionnaire_items = resultTaskRlt[2];
                            projectInfo.task_items[index].task_scale_items = resultTaskRlt[3];
                            projectInfo.task_items[index].task_attachment_items = resultTaskRlt[4];
                            index++;
                            // 执行完成后也要调用callback，不需要参数
                            callback();
                        });
                    }, function (err) {
                        // 所有执行完成后回调
                        if (err) {
                            $util.resJSONError(errTask, res);
                            return;
                        } else {
                            $util.resJSON.resultnum = $util.resConfig.ok;
                            $util.resJSON.resultdata = projectInfo;
                            res.json($util.resJSON);
                        }
                    });

                });
            }
            catch (error) {
                $util.resJSONError(error, res);
            }
        });
    },

    /* 获取项目列表
     * byx 2017-5-11 14:45:47
     * params
     * @req
     * @res
     *
     * return res.json();
     * */
    getProjectList: function (req, res, next) {
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

//处理方便入库的项目任务集合
var makeTaskArray = function (projectTaskInfo) {
    var result = {
        task_grade_items: [],
        task_questionnaire_items: [],
        task_scale_items: [],
        task_attachment_items: []
    };
    // 处理 任务学校、年级、角色的集合
    //如果角色是学生/家长的话，为所有选中学校的所有选中年级赋值，否则只保存角色与学校即可
    if (projectTaskInfo.task_item.in_role == "学生" || projectTaskInfo.task_item.in_role == "家长") {
        projectTaskInfo.task_item.task_grade_items.forEach(function (itemGrade, indexGrade) {
            projectTaskInfo.task_item.task_school_items.forEach(function (itemSch, indexSch) {
                var task_grade_obj = {};
                task_grade_obj.project_id = projectTaskInfo.project_id;
                task_grade_obj.task_id = projectTaskInfo.task_item.task_id;
                task_grade_obj.school_id = itemSch.school_id;
                task_grade_obj.school_name = itemSch.school_name;
                task_grade_obj.grade_id = itemGrade.grade_id;
                task_grade_obj.grade_name = itemGrade.grade_name;
                task_grade_obj.in_role = projectTaskInfo.task_item.in_role;

                result.task_grade_items.push(task_grade_obj);
            })
        })
    } else {//只保存角色与学校即可
        projectTaskInfo.task_item.task_school_items.forEach(function (itemSch, indexSch) {
            var task_grade_obj = {};
            task_grade_obj.project_id = projectTaskInfo.project_id;
            task_grade_obj.task_id = projectTaskInfo.task_item.task_id;
            task_grade_obj.school_id = itemSch.school_id;
            task_grade_obj.school_name = itemSch.school_name;
            task_grade_obj.grade_id = "";
            task_grade_obj.grade_name = "";
            task_grade_obj.in_role = projectTaskInfo.task_item.in_role;

            result.task_grade_items.push(task_grade_obj);
        })
    }


    // 处理 任务问卷的集合
    projectTaskInfo.task_item.task_questionnaire_items.forEach(function (item, index) {
        var task_questionnaire_obj = {};
        task_questionnaire_obj.project_id = projectTaskInfo.project_id;
        task_questionnaire_obj.task_id = projectTaskInfo.task_item.task_id;
        task_questionnaire_obj.questionnaire_id = item.questionnaire_id;
        task_questionnaire_obj.questionnaire_name = item.questionnaire_name;

        result.task_questionnaire_items.push(task_questionnaire_obj);
    })
    // 处理 任务量表的集合
    projectTaskInfo.task_item.task_scale_items.forEach(function (item, index) {
        var task_scale_obj = {};
        task_scale_obj.project_id = projectTaskInfo.project_id;
        task_scale_obj.task_id = projectTaskInfo.task_item.task_id;
        task_scale_obj.scale_id = item.scale_id;
        task_scale_obj.scale_name = item.scale_name;

        result.task_scale_items.push(task_scale_obj);
    })
    // 处理 任务附件的集合
    projectTaskInfo.task_item.task_attachment_items.forEach(function (item, index) {
        var task_attachment_obj = {};
        task_attachment_obj.project_id = projectTaskInfo.project_id;
        task_attachment_obj.task_id = projectTaskInfo.task_item.task_id;
        task_attachment_obj.attachment_id = item.attachment_id;
        task_attachment_obj.attachment_name = item.attachment_name;

        result.task_attachment_items.push(task_attachment_obj);
    })

    return result;
};