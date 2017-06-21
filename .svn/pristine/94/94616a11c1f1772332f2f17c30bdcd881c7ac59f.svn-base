/*
 2017年5月12日 13:53:36
 byx
 基础数据数据同步-机构模块的dao层,sql语句
 * */

var organ = {
    //插入机构信息
    addOrganList: function (organ_item) {
        var sql = "INSERT INTO bd_organ (organ_id, organ_name, is_root, has_child, create_time, p_organ_id, p_organ_name) ";
        sql += "  VALUES "
        var arrLength = arrTaskGrade.length;
        organ_item.forEach(function (item, index) {
            sql += "('"
                + item.organ_id + "', '"
                + item.organ_name + "', '"
                + item.is_root + "', '"
                + item.has_child + "', '"
                + item.create_time + "',  '"
                + item.p_organ_id + "',  '"
                + item.p_organ_name + "') ";
            if ((index + 1) < arrLength) {
                sql += ",";
            }
        });
        return sql;
    }

};

module.exports = organ;