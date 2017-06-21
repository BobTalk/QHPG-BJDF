/**
 * Created by byx on 17/5/17.
 * 用户操作sql语句
 */
var studentInfo = {
    //添加
    saveInfo: function (userInfo) {
        var userSql = [];
        var sql = "";
        userSql = userInfo;
        var arrLength = userSql.length;
        sql += "INSERT INTO bd_studentinfo (user_id, stu_num, true_name, server_id, server_name, sex, birthday, nation)"
            + "VALUES";
        userSql.map(function (item, index) {
            sql += "('"
                + item.user_id + "', '"
                + item.stu_num + "', '"
                + item.true_name + "', '"
                + item.server_id + "', '"
                + item.server_name + "', '"
                + item.sex + "', '"
                + item.birthday + "', '"
                + item.nation + "') ";
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
        sql = "DELETE FROM bd_studentinfo WHERE user_id IN (";
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
            var sql = "UPDATE bd_studentinfo SET";
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
module.exports = studentInfo;