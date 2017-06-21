/**
 * Created by byx on 17/5/18.
 * 用户操作sql语句
 */
var organInfo = {
    //添加
    saveInfo: function (userInfo) {
        var userSql = [];
        var sql = "";
        userSql = userInfo;
        var arrLength = userSql.length;
        sql += "INSERT INTO bd_organ (organ_id,organ_name,is_root,has_child,p_organ_id,p_organ_name)"
            + "VALUES";
        userSql.map(function (item, index) {
            sql += "('"
                + item.organ_id + "', '"
                + item.organ_name + "', '"
                + item.is_root + "', '"
                + item.has_child + "', '"
                + item.p_organ_id + "', '"
                + item.p_organ_name + "') ";
            if ((index + 1) < arrLength) {
                sql += ",";
            }
        })
        return sql;
    },
    //删除
    removeInfo: function (userId) {
        var sql = "";
        var arrLength = userId.length;
        sql = "DELETE FROM bd_organ WHERE organ_id IN (";
        userId.map(function (item, index) {
            sql += item.organ_id;
            if ((index + 1) < arrLength) {
                sql += ",";
            }
        });
        sql += ")";
        return sql;
    },
    //更新
    updataInfo: function (userInfo) {
        var arrySql = [];
        for (var i = 0, len = userInfo.length; i < len; i++) {
            var sql = "UPDATE bd_organ SET";
            sql += " ";
            for (key in userInfo[i]) {
                if (key != "organ_id") {
                    sql += key + "='" + userInfo[i][key] + "'";
                    if ((i + 1) <= userInfo.length) {
                        sql += ",";
                    }
                }
            }
            // sql = sql.substring(0, sql.length - 1);在key=value时后面没有空格是可以的 如果有空格则会出错
            sql = sql.substring(0, sql.lastIndexOf(","));
            sql += " WHERE";
            for (key in userInfo[i]) {
                if (key == "organ_id") {
                    sql += " " + key + "='" + userInfo[i][key] + "';";
                }
            }
            arrySql.push(sql);
        }
        return arrySql;
    }
};
module.exports = organInfo;