/*
 2017年5月23日 16:35:56
 byx
 评估管理-问卷指标分数模块的service层
 * */
var $writelog = require('../libs/logHelper');
var $util = require('../../util/util');
var async = require('async');
var questionnaireDao = require('../../dao/pgmanage_dao/questionnaireStandScoreDao');

module.exports = {
    //插入问卷
    insertQuestionnaire: function () {
        try {

        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        //1.获取所有学校所有指标的问卷答题平均分
        questionnaireDao.getQuestionnaireStandAvgScore(function (err, result) {
            if (err != null) {
                $writelog.helper.writeInfo("定时器统计学校指标得分错误信息：" + err.stack);
                return;
            }
            //async.eachSeries保证了的执行顺序，而且当其中一条执行异常，就不会继续执行下一条
            //非异步循环更新分数结果表
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
    }
};
