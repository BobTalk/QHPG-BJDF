/*
 2017年5月23日 16:40:50
 byx
 评估管理-问卷指标分数模块的dao层,sql语句
 * */

var Questionnaire = {

    //获取所有学校所有指标的问卷答题平均分 by  byx
    getQuestionnaireStandAvgScore: "SELECT s.*,b.school_name,TRUNCATE(AVG(score),2) AS avg_score FROM submit_stand_score_result s JOIN bd_schoolinfo b ON s.school_id= b.school_id GROUP BY school_id,stand_id"
};

module.exports = Questionnaire;