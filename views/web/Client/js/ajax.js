/**
 * Created by sanghuina on 17/1/2.http://101.200.231.203:7000/QHPG/web/webIBD/login.html
 */
//var baseUrl = "http://192.168.1.131:8080/QHPG/page/";
//var baseUrl = "http://"+location.host+"/QHPG/page/";
var baseUrl ="http://192.168.1.73/QHPG-BJDF1/";//"http://10.0.0.3:8081/QHPG-BJDF/";
function getdata(iter, p, _callback) {
    var obj;
    if (p) {
        obj = {JSONPARAM: JSON.stringify(p)};
    }
    $.ajax({
        type: iter.itype,
        url: baseUrl + iter.iname+"?_n="+Date.parse(new Date())/1000,
        data: obj,
        datatype:"JSON",
        success: function (res) {
            //后台返回的是json
            //res = JSON.parse(res);
            _callback(res);
        },
        error: function (e) {
        }
    });
};