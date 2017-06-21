/*
 2017年5月4日 16:40:50
 byx
 基础数据-学校模块的dao层,sql语句
 * */

var school = {
    //获取学校列表
    getSchoolList: function (school_types, organ_ids) {
        var sql = "SELECT DISTINCT	school_id, school_name, adress, description, server_id, p_organ_id, educationBureau, tag, TYPE, createTime, p_organ_name ";
        sql += "FROM bd_schoolinfo  ";
        if (organ_ids != "-1") {
            sql +=  "WHERE p_organ_id IN (" + organ_ids + ")";
            if (school_types != '-1') {
                sql += " and type IN (" + school_types + ")";
            }
        } else if (school_types != '-1') {
            sql += " where type IN (" + school_types + ")";
        }
        return sql;
    }
};

module.exports = school;