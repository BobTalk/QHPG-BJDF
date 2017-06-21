/*
 2017年4月15日 16:49:31
 byx
 基础数据的dao层,sql语句
 * */

var user = {
    //用户登录，返回用户基本信息，暂时注释密码验证，默认密码123456
    getSchedule: 'SELECT sch.schoolname AS schoolName,userinfo.roleTag,COUNT(userinfo.userId) AS userCount,COUNT(sub.id) AS subUserCount,sch.serverid AS schoolId FROM userinfo JOIN schoolinfo sch ON userinfo.serverId=sch.serverid LEFT JOIN papersubmitcontent sub ON userinfo.userId = sub.userId GROUP BY userinfo.serverId,userinfo.roleTag',//  AND PASSWORD = ?
    // insert: 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
    update: 'update user set name=?, age=? where id=?',
    delete: 'delete from user where id=?',
    queryById: 'select * from user where id=?',
    queryAll: 'select * from user'
};

module.exports = user;