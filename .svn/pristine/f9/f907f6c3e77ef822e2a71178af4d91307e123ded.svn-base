/**
 * Created by sanghuina on 17/5/9.
 * 举报的查询sql语句
 */
var $util = require('../../util/util');
var tipoff = {
    /*根据角色获取举报列表,*/
    getTipoffList: function (use_role, user_id,service_id,state,type, pagesize, pagenum) {
        var sql = "SELECT tipoff_id,tipoff_type,stand_id,iphone,tip_school_name,tip_time,user_id,user_name,school_id,school_name,tip_content,state,tipoff.create_time,score,tipoff_type_name  ";
        sql += "FROM tipoff ";
        if (use_role== "教育局人员") {
            //教育局人员取所有
            sql += " where 1=1 ";
            if(service_id!="-1"){
                sql += " and school_id = '" + service_id + "'";
            }
        } else if (use_role == '教管中心人员') {
            //教管中心人员取其管辖的所有学校数据
            sql += " left join bd_organ on school_id=organ_id where p_organ_id='"+service_id+"'";
        }else if(use_role == '校长'){
            sql += " where school_id = '" + service_id + "'";
        }else{
            //个人
            sql += " where user_id = '" + user_id + "'";
        }
        if(state!="-1"){
            sql += " and state = " + state;
        }
        if(type!="-1"){
            sql += " and tipoff_type = " + type;
        }
        if(state=="1"){
            /*已审批通过的列表按照审批时间倒叙*/
            sql += " ORDER BY examine_time DESC  LIMIT " + pagenum + ", " + pagesize ;
        }
        else{
            sql += " ORDER BY create_time DESC, state asc  LIMIT " + pagenum + ", " + pagesize ;
        }
        return sql;
    },
    /*根据角色获取举报列表-总数*/
    getTipoffListRows: function (use_role, user_id,service_id,state,type) {
        var sql = "SELECT count(tipoff_id) as rows FROM tipoff ";
        if (use_role== "教育局人员") {
            //教育局人员取所有
            sql += " where 1=1 ";
            if(service_id!="-1"){
                sql += " and school_id = '" + service_id + "'";
            }
        } else if (use_role == '教管中心人员') {
            //教管中心人员取其管辖的所有学校数据
            sql += "  left join bd_organ on school_id=organ_id where p_organ_id='"+service_id+"'";
        }else if(use_role == '校长'){
            sql += " where school_id = '" + service_id + "'";
        }else{
            //个人
            sql += " where user_id = '" + user_id + "'";
        }
        if(state!="-1"){
            sql += " and state = " + state;
        }
        if(type!="-1"){
            sql += " and tipoff_type = " + type;
        }
        return sql;
    },
    /*举报插入*/
    addTipoff:'insert into tipoff (tipoff_type,stand_id,iphone,tip_school_name,tip_time,user_id,user_name,school_id,school_name,tip_content,state,score,tipoff_type_name) values(?,?,?,?,?,?,?,?,?,?,?,?,?)',
    /*举报修改*/
    updateTipoff:'update tipoff set tipoff_type=?,stand_id=?,iphone=?,tip_school_name=?,tip_time=?,user_id=?,user_name=?,school_id=?,school_name=?,tip_content=?,state=?,score=?,tipoff_type_name=? where tipoff_id=?',
    /*举报删除*/
    deleteTipoff: 'delete from tipoff where tipoff_id=?',
   /* 举报详情*/
    getTipoffInfo: 'select tipoff_id,tipoff_type,stand_id,iphone,tip_school_name,tip_time,user_id,user_name,school_id,school_name,tip_content,state,create_time,score,tipoff_type_name from tipoff where tipoff_id=? ',
    updatetipState:"update tipoff set state=?,examine_time='"+$util.getDateTime()+"' where tipoff_id=?",
    /*指标得分结果插入*/
    insertScoreResult:"insert into score_result (stand_id,school_id,school_name,score,score_source) values (?,?,?,?,?)"
};

module.exports = tipoff;