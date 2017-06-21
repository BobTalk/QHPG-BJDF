/**
 * Created by byx on 17/5/17.
 * 用户操作sql语句
 */
var userInfo = {
    //添加
    saveInfo: function (userInfo) {
        var userSql = [];
        var sql = "";
        userSql = userInfo;
        var arrLength = userSql.length;
        sql += "INSERT INTO bd_userinfo (user_id, user_name, password, true_name, role_name, server_id, role_id, sex)"
            + "VALUES";
        userSql.map(function (item, index) {
            sql += "('"
                + item.user_id + "', '"
                + item.user_name + "', '"
                + item.password + "', '"
                + item.true_name + "', '"
                + item.role_name + "', '"
                + item.server_id + "', '"
                + item.role_id + "', '"
                + item.sex + "') ";
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
        sql = "DELETE FROM bd_userinfo WHERE user_id IN (";
        userId.map(function (item, index) {
            sql += item.user_id;
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
            var sql = "UPDATE bd_userinfo SET";
            sql += " ";
            for (key in userInfo[i]) {
                if (key != "user_id") {
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
                if (key == "user_id") {
                    sql += " " + key + "='" + userInfo[i][key] + "';";
                }
            }
            arrySql.push(sql);
        }
        return arrySql;
    }
};
module.exports = userInfo;