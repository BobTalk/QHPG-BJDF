/**
 * Created by bainiu on 2017-03-28 16:58:00.
 * excel操作工具类
 */

var fs = require('fs');
var xlsx = require('node-xlsx');
var $util = require('../util/util');

module.exports = {
    /** 解析问卷excel 变成json
     *
     * @param {String} input - 要处理的 excel 源文件地址
     * @return {Object} 返回
     */
    parseJsonQuestionnaire: function (path, questionnaire_id) {
        var result = [];
        var questionnaire_question = {
            question_id: "",//问题ID
            questionnaire_id: questionnaire_id,//问卷ID
            q_order: "",//问题顺序
            q_score: "",//分值
            q_type: "",//题型:单选/多选/填空/其它
            content: "",//问题内容
            option_id: "",//问题选项组ID
            stand_id: "",//所属指标ID
            rule: "",//问题规则：填空题{1=整型/2=小数保留一位/3=小数保留两位/4=日期};多选题{1=选一项给分/2=选多项给分}
            option_direction: "",//选项正负方向：正=分值越高越好;负=分值越低越好;
            option_order: "",//选项排列：1=横向;2=纵向;
            question_options: [{
                option_id: "",
                option_content: "",
                option_order: "",
                option_score: "",
                questionnaire_id: "",
                question_id: ""
            }]
        };

        var book = xlsx.parse(path);
        if (book[0].data.length != 0) {
            book = book[0].data;
        } else {
            return null;
        }
        //循环工作表中的每行
        book.forEach(function (item, index) {
            questionnaire_question = {};
            //过滤第一行头
            if (index != 0) {
                var question_id = $util.GUID();
                questionnaire_question.question_id = question_id;
                questionnaire_question.questionnaire_id = questionnaire_id;
                var options = [];
                //循环每行的所有列
                item.map(function (col, col_index) {
                    var option = {};
                    switch (col_index) {
                        case 0:
                            questionnaire_question.option_direction = col;
                            break;
                        case 1:
                            questionnaire_question.stand_id = col;
                            break;
                        case 2:
                            questionnaire_question.q_order = col;
                            break;
                        case 3:
                            questionnaire_question.option_order = col;
                            break;
                        case 4:
                            questionnaire_question.rule = col;
                            break;
                        case 5:
                            questionnaire_question.q_type = col;
                            break;
                        case 6:
                            questionnaire_question.content = col;
                            break;
                        default:
                            option.option_id = $util.GUID();
                            option.questionnaire_id = questionnaire_id;
                            option.question_id = question_id;
                            option.option_content = col.split('.')[1];
                            option.option_order = col_index + 1;
                            option.option_score = col.split('.')[0];
                            options.push(option);
                            break;
                    }
                })
                questionnaire_question.question_options = options;
                result.push(questionnaire_question);
            }
        });

        return result;
    }

}