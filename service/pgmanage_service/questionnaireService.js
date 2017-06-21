/*
 2017年5月4日 16:35:56
 byx
 评估管理-问卷模块的service层
 * */
var $util = require('../../util/util');
var $excelUtil = require('../../util/excelUtil');
var async = require('async');
var fs = require('fs');
var querystring = require('querystring');
var iconv = require("iconv-lite");
var urlencode = require('urlencode');
var questionnaireDao = require('../../dao/pgmanage_dao/questionnaireDao');

module.exports = {
    //获取问卷列表
    getQuestionnaireList: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            var use_role = param.use_role;//使用对象，无此条件时传空
            use_role = $util.isNull(use_role) ? "-1" : use_role;
            var use_xueduan_items = param.use_xueduan_items;//使用学段集合
            use_xueduan_items = use_xueduan_items.length == 0 ? "-1" : $util.strArrayToString(use_xueduan_items);
            // 分页
            var pagesize = param.page_size;
            var pagenum = param.page_num;
            pagenum = (pagenum - 1) * pagesize;
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        questionnaireDao.getQuestionnaireList(use_role, use_xueduan_items, pagesize, pagenum, function (err, result) {
            try {
                if (err != null) {
                    $util.resJSONError(err, res);
                    return;
                }
                questionnaireDao.getQuestionnaireListRows(use_role, use_xueduan_items, function (errRows, resultRows) {
                    if (errRows != null) {
                        $util.resJSONError(errRows, res);
                        return;
                    }
                    $util.resJSON.resultnum = $util.resConfig.ok;
                    $util.resJSON.resultdata = result;
                    $util.resJSON.rows = resultRows[0].rows;
                    res.json($util.resJSON);
                });
            }
            catch (error) {
                $util.resJSONError(error, res);
            }
        });
    },
    //获取问卷列表 by hyq
    getQuestionnaireList2: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            var use_role = param.use_role;//使用对象，无此条件时传空
            use_role = $util.isNull(use_role) ? "-1" : use_role;
            var use_xueduan_items = param.use_xueduan_items;//使用学段集合
            use_xueduan_items = use_xueduan_items.length == 0 ? "-1" : $util.strArrayToString(use_xueduan_items);
            var questionnaire_name = param.questionnaire_name;
            questionnaire_name = $util.isNull(questionnaire_name) ? "-1" : questionnaire_name;
            // 分页
            var pagesize = param.page_size;
            var pagenum = param.page_num;
            pagenum = (pagenum - 1) * pagesize;
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }

        var questionnaire_list = [];
        questionnaireDao.getQuestionnaireList2(questionnaire_name, use_role, use_xueduan_items, pagesize, pagenum, function (err, result) {
            try {
                if (err != null) {
                    $util.resJSONError(err, res);
                    return;
                }
                //async.eachSeries保证了的执行顺序，而且当其中一条执行异常，就不会继续执行下一条
                //非异步循环获取问卷所属学段
                async.eachSeries(result, function (questionnaireItem, callback) {
                    var questoinnaire_info = questionnaireItem;
                    questionnaireDao.getQuestionnaireXueduan(questionnaireItem, function (errXueduan, resultXueduan) {
                        if (errXueduan != null) {
                            $util.resJSONError(errXueduan, res);
                            return;
                        }
                        questoinnaire_info.use_xueduan_items = resultXueduan;
                        questionnaire_list.push(questoinnaire_info);
                        //获取成功当前问卷的学段，继续获取下一个问卷
                        callback();
                    });
                }, function (err) {
                    // 所有执行完成后回调
                    if (err) {
                        $util.resJSONError(err, res);
                        return;
                    } else {
                        questionnaireDao.getQuestionnaireListRows2(questionnaire_name, use_role, use_xueduan_items, function (errRows, resultRows) {
                            if (errRows != null) {
                                $util.resJSONError(errRows, res);
                                return;
                            }
                            $util.resJSON.resultnum = $util.resConfig.ok;
                            $util.resJSON.rows = resultRows[0].rows;
                            $util.resJSON.resultdata = questionnaire_list;
                            res.json($util.resJSON);
                        });
                    }
                });

            }
            catch (error) {
                $util.resJSONError(error, res);
            }
        });
    },
    //导入问卷
    importQuestionnaire: function (req, res, next) {
        try {
            var path = "../resource/questionnaire/";//问卷地址
            var fileData = "";

            req.addListener('data', function (chunk) {
                fileData += chunk;
            }).addListener('end', function () {
                try {
                    var param = querystring.parse(fileData);
                    param = JSON.parse(param.JSONPARAM);
                    var file_name = Math.random() + "-" + param.file_name;
                    path = path + file_name;
                    fileData = param.fileData;
                    var base64Data = JSON.stringify(fileData).split("base64,")[1];
                    var dataBuffer = new Buffer(base64Data, 'base64');
                    fs.writeFileSync(path, dataBuffer);
                    $util.resJSON.resultnum = $util.resConfig.ok;
                    $util.resJSON.resultdata = {excel_name: file_name};
                    res.json($util.resJSON);
                }
                catch (error) {
                    $util.resJSONError(error, res);
                    return;
                }
            })
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
    },
    //插入问卷
    insertQuestionnaire: function (req, res, next) {
        var path = "../resource/questionnaire/";//问卷地址
        try {
            //获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            var questionnaireInfo = {};
            questionnaireInfo.questionnaire_name = param.questionnaire_name;
            questionnaireInfo.descript = param.descript;
            questionnaireInfo.load_user_id = param.load_user_id;
            questionnaireInfo.use_role = param.use_role;
            questionnaireInfo.xueduan_items = param.xueduan_items;
            var file_name = param.file_name;
            path = path + file_name;
            var questionnaire_id = $util.GUID();
            questionnaireInfo.questionnaire_id = questionnaire_id;
            //返回问卷JSON数据
            var excelJson = $excelUtil.parseJsonQuestionnaire(path, questionnaire_id);
            questionnaireInfo.questionnaire_questoin = excelJson;
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        //先保存问卷基本信息和学段
        questionnaireDao.saveQuestionnaire(questionnaireInfo, function (errQuestoinnaire, resultQuestionnaire) {
            if (errQuestoinnaire != null) {
                $util.resJSONError(errQuestoinnaire, res);
                return;
            }
            //async.eachSeries保证了的执行顺序，而且当其中一条执行异常，就不会继续执行下一条
            //非异步循环保存问卷问题
            async.eachSeries(excelJson, function (questionItem, callback) {
                questionnaireDao.saveQuestion(questionItem, function (errQuestion, resultQuestion) {
                    if (errQuestion != null) {
                        $util.resJSONError(errQuestion, res);
                        return;
                    }
                    //非异步循环保存答案
                    async.eachSeries(questionItem.question_options, function (optionItem, callback2) {
                        questionnaireDao.saveOption(optionItem, function (errOption, resultOption) {
                            if (errOption != null) {
                                $util.resJSONError(errOption, res);
                                return;
                            }
                            //插入当前选项后，插入下一个选项
                            callback2();
                        })
                    }, function (err) {
                        // 所有执行完成后回调
                        if (err) {
                            $util.resJSONError(err, res);
                            return;
                        }
                        //当前问题所有选项插入完成，进入下一题的保存
                        callback();
                    })
                });
            }, function (err) {
                // 所有执行完成后回调
                if (err) {
                    $util.resJSONError(err, res);
                    return;
                } else {
                    //此处添加生成文件html的方法,使用excelJson
                    $util.resJSON.resultnum = $util.resConfig.ok;
                    $util.resJSON.resultdata = {questionnaire_info: questionnaireInfo};
                    res.json($util.resJSON);
                }
            });
        })
    },
    //生成问卷html
    buildQuestionnaireHtml: function (req, res, next) {
        try {
            var path = "../views/web/Client/questionhtml/";//问卷地html址
            var htmlData = "";
            req.addListener('data', function (chunk) {
                htmlData += chunk;
            }).addListener('end', function () {
                try {
                    var param = querystring.parse(htmlData);
                    param = JSON.parse(param.JSONPARAM);
                    var file_name = param.questionnaire_id;
                    path = path + file_name + ".html";
                    htmlData = param.html_data;
                    htmlData = JSON.stringify(htmlData);
                    //htmlData = iconv.decode(Buffer.concat(htmlData), 'UTF-8');
                    htmlData = urlencode.decode(htmlData, 'utf-8');
                    fs.writeFileSync(path, htmlData);
                    $util.resJSON.resultnum = $util.resConfig.ok;
                    $util.resJSON.resultdata = {questionnaire_id: file_name};
                    res.json($util.resJSON);

                } catch (error) {
                    $util.resJSONError(error, res);
                    return;
                }
            })

        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
    },
    //删除问卷 by hyq
    deleteQuestoinnaire: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            var questionnaire_id = param.questionnaire_id;
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        questionnaireDao.removeQuestionnaire(questionnaire_id, function (err, result) {
            if (err != null) {
                $util.resJSONError(err, res);
                return;
            }
            $util.resJSON.resultnum = $util.resConfig.ok;
            $util.resJSON.resultdata = {affectedRows: result.affectedRows};
            res.json($util.resJSON);
        });
    },
    //更新问卷 by hyq
    updateQuestoinnaire: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        questionnaireDao.updateQuestionnaire(param, function (err, result) {
            if (err != null) {
                $util.resJSONError(err, res);
                return;
            }
            $util.resJSON.resultnum = $util.resConfig.ok;
            $util.resJSON.resultdata = {affectedRows: result.affectedRows};
            res.json($util.resJSON);
        });
    },
    //获取问卷详情
    getQuestoinnaireInfo: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            getQuestoinnaireId = param.questionnaire_id;
        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        var questionnaire_info = {};
        questionnaireDao.getQuestionnaire(getQuestoinnaireId, function (err, result) {
            if (err != null) {
                $util.resJSONError(err, res);
                return;
            }
            if (result.length == 0) {
                $util.resJSON.resultnum = $util.resConfig.ok;
                $util.resJSON.resultdata = {};
                res.json($util.resJSON);
            }
            questionnaire_info = result[0];
            questionnaireDao.getQuestionnaireXueduan(questionnaire_info, function (errXueduan, resultXueduan) {
                if (errXueduan != null) {
                    $util.resJSONError(errXueduan, res);
                    return;
                }
                questionnaire_info.xueduan_items = resultXueduan;
                $util.resJSON.resultnum = $util.resConfig.ok;
                $util.resJSON.resultdata = questionnaire_info;
                res.json($util.resJSON);
            });
        });
    }
};
