/**
 * Created by sanghuina on 17/1/10.客户端公共js方法
 */

var initPopuDiv=function(){
        $(document.body).append("<div class=\"mask\"></div>");
        var studentToast = [
            '<div id="gx1" name="gx1" class="tan" style="display:none;">',
            '<div class="tan_closestu"><a href="javascript:void(0);"></a></div>',
            '<div class="gxcon1"></div>',
            '</div>'
        ].join('');
        $(document.body).append(studentToast);
        var OtherToast = [
            '<div id="gx12"  name="gx12" class="tan" style="display:none;">',
            '<div class="tan_closestu"><a href="javascript:void(0);"></a></div>',
            '<div class="gxcon1"></div>',
            '</div>'
        ].join('');
        $(document.body).append(OtherToast);
        var AlertToast = [
            '<div id="AlertToast" name="AlertToast" class="tan" style="display:none;">',
            '<div class="tan_close"><span>信息</span><a href="javascript:void(0);"></a></div>',
            '<div class="alertconment"><i class="error"></i></div>',
            '</div>'
        ].join('');
        $(document.body).append(AlertToast);
        var MsgToast = [
            '<div id="MsgToast" name="MsgToast" class="tan" style="display:none;">',
            '<div class="alertconment"></div>',
            '</div>'
        ].join('');
        $(document.body).append(MsgToast);
        var LoadToast = [
            '<div id="LoadToast" name="LoadToast" class="tan" style="display:none;">',
            '<i class="loading"></i>数据加载中......</div>'
        ].join('');
        $(document.body).append(LoadToast);
        $(".tan_closestu").click(function(){
            alertclose();
        });
        $(".tan_close").click(function(){
            alertclose();
        });

    },
alertpop=function(popid,conment,icon){//LoadToast:loading;AlertToast:有遮罩的不自动关闭的提示信息；MsgToast:没有遮罩的自动关闭的提示信息；
        if(popid=="AlertToast"){
            //显示遮罩层
            $(".mask").attr("style","display:block");
            $("#"+popid+" .alertconment").html("<i class='"+icon+"'></i>"+conment);
        }else if(popid=="MsgToast"){
            $("#"+popid+" .alertconment").html(conment);
            setTimeout(function(){
                $("#"+popid).css("display","none");
            },2000);
        }else if(popid=="LoadToast"){
            //显示遮罩层
            $(".mask").attr("style","display:block");
            conment=conment||"数据加载中......"
            $("#"+popid).html("<i class='loading'></i>"+conment);
        }
        $("#"+popid).attr("style","display:block");
    },
alertclose=function(){
        $(".mask").attr("style","display:none;");
        $(".tan").attr("style","display:none;");
    },
getUrlPara= function(m){
   var sValue = location.search.match(new RegExp("[\?\&]" + m + "=([^\&]*)(\&?)", "i"));
   return sValue ? sValue[1] : sValue;
};
//20170516 add by 文霞 获取用户信息
var _UserObject={
    user_id: "",//"1",//用户id
    user_dlm: "",//""//用户登录名
    user_name: "",//"测试用户",//用户真实姓名
    user_role: "",//"2",//角色值为数字；0无权限，1超级管理员，2教育局人员(教育局管理员),3教官中心人员(教官中心管理员),4校长（学校管理员）,5资料管理员(学校资料上传,量表填写),6教师,7学生
    server_id: "",//"652ffb6afea946c29ed29eda3dc0b579",// 人员所在集团id
    server_name: "",//"清华大学附属中学",// 人员所在集团名称,学校名称/教育局名称等
    user_sex: "",//"0",//  用户性别;
    grade_id: "",//"1",//  年级主键;
    class_id: "",//"1",//  班级主键;
    grade_name: "",//"一年级",//  年级名称;
    class_name: "",//"一班",//  班级名称
    user_img: "",//"http://scs.ganjistatic1.com/gjfs15/M08/06/44/CgEHQVYPQi3GOVq0AADKyBjz9NA161_600-0_6-0.jpg",// 用户头像;
    user_age: "",//"1",//  用户年龄;
    user_type: "",//"1",//  用户类型;0无类型，1老师，2学生，3家长
    user_phone: "",//"1",//  用户电话;
    user_email: "",//"1",//  用户邮件;
    state: "",//"1",//启用状态；0未启用，1启用
    xz: ""//"",//学制：1小学五年制，2小学六年制，3初中三年制，4初中四年制，5高中,6是完中(初中和高中共存),7幼儿园
};
//window.onload=function(){
//
//};
$(window).on("load",function(){
    //获取用户信息
    _UserObject.user_id = getUrlPara("uid");
    _UserObject.server_id = getUrlPara("serid");
    _UserObject.user_role = decodeURIComponent(getUrlPara("role"));
    _UserObject.grade_id = getUrlPara("grade_id");
    _UserObject.grade_name = decodeURIComponent(getUrlPara("grade_name"));
});

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(s, i) {
        return args[i];
    });
};
// 渲染分页条的显示视图
var pagePlugin={
    pageSize:10,
    index:1,
    init:function($pageWrapper,pageSize,callback){
        var elStr=['<div style="background-color:#fff; height:70px">',
            '<div class="col-md-5 col-sm-12" style="float: left;width: 50%;">',
            '<div class="dataTables_info"></div>',
            '</div>',
            '<div class="col-md-7 col-sm-12" style="float: left;width: 50%;">',
            '<div class="dataTables_paginate paging_simple_numbers" style="text-align: right;">',
            '<ul class="pagination"></ul>',
            '</div>',
            '</div>',
            '</div><div class="dataFooter"><ul><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul></div>'].join("");
        $pageWrapper.html(elStr);
        if(pageSize){
            pagePlugin.pageSize=pageSize;
        }
        if(callback){
            pagePlugin.callback=callback;
        }
    },
    renderPaging:function(total, rows) {
        total = total ? total : 0;
        rows = rows ? rows : 0;
        var index = parseInt(pagePlugin.index);

        // 隐藏更多页数的符号
        var moreSignal = "...";

        var me = this;
        var pagingOptions = {pageSize:pagePlugin.pageSize,"info" : "当前显示第 {0} 到第 {1} 条数据,总计  {2} 条数据",
            "emptyInfo" : "没有数据"};
        // 每页条数
        var pageSize = pagingOptions.pageSize;
        // 总页数
        var pageTotal = Math.ceil(total / pagingOptions.pageSize);
        this.pageTotal = pageTotal;
        // 最多显示的页码个数
        var pageMax = 7;
        // 页码区域
        var ulNew=$(".pagination");

        // 消息区域
        var infoAreaNew=$(".dataTables_info");
        // 页码
        var liArrayNew=new Array();//By Wendy

        var info = rows > 0 ? pagingOptions.info : pagingOptions.emptyInfo;

        // 页码太多需要部分显示，有三种显示方式
        // 1,2,3,4,5...,10;1,...,4,5,6...,10;1,...,6,7,8,9,10
        if (pageTotal > pageMax) {
            //下面的逻辑待修改
            // 第一种
            if (index <= pageMax - 3) {
                for (var i = 1; i <= pageMax - 2; i++) {
                    liArrayNew.push("<li class='paginate_button "+(index==i?"active":"")+"' ><a href='javascript:;'>" + i + "</a></li>");
                }
                liArrayNew.push("<li  class='paginate_button '><a href='javascript:;'>" + moreSignal + "</a></li>");
                liArrayNew.push("<li class='paginate_button "+(index==pageTotal?"active":"")+"' ><a href='javascript:;'>" + pageTotal + "</a></li>");
            }
            // 第二种
            else if (index > pageMax - 3 && index <= pageTotal - 4) {
                liArrayNew.push("<li  class='paginate_button "+(index==1?"active":"")+"'><a href='javascript:;'>1</a></li>");
                liArrayNew.push("<li  class='paginate_button '><a href='javascript:;'>" + moreSignal + "</a></li>");
                for (var i = index - 1; i <= index + pageMax - 6; i++) {
                    liArrayNew.push("<li class='paginate_button "+(index==i?"active":"")+"' ><a href='javascript:;'>" + i + "</a></li>");
                }
                liArrayNew.push("<li  class='paginate_button '><a href='javascript:;'>" + moreSignal + "</a></li>");
                liArrayNew.push("<li class='paginate_button "+(index==pageTotal?"active":"")+"' ><a href='javascript:;'>" + pageTotal + "</a></li>");
            } else {
                liArrayNew.push("<li  class='paginate_button "+(index==1?"active":"")+"'><a href='javascript:;'>1</a></li>");
                liArrayNew.push("<li  class='paginate_button '><a href='javascript:;'>" + moreSignal + "</a></li>");

                for (var i = pageTotal - pageMax + 3; i <= pageTotal; i++) {
                    liArrayNew.push("<li class='paginate_button "+(index==i?"active":"")+"' ><a href='javascript:;'>" + i + "</a></li>");
                }
            }
            info = info.format((index - 1) * pageSize + 1, (index - 1) * pageSize + rows, total);
        } else if (pageTotal > 0) {
            for (var i = 1; i <= pageTotal; i++) {
                liArrayNew.push("<li class='paginate_button "+(index==i?"active":"")+"' ><a href='javascript:;'>" + i + "</a></li>");
            }
            info = info.format((index - 1) * pageSize + 1, (index - 1) * pageSize + rows, total);
        }
        // 没有数据
        else {
            ulNew.html("");
            info = pagingOptions.emptyInfo;
        }
        liArrayNew.unshift("<li class='paginate_button previous "+(index==1?"disabled":"")+"' id='datatable_previous'><a href='javascript:;'>&lt;</a></li>");
        liArrayNew.push("<li class='paginate_button next "+(index==pageTotal?"disabled":"")+"' id='datatable_next'><a href='javascript:;'>&gt;</a></li>");

        ulNew.html(liArrayNew.join(""));
        infoAreaNew.html(info);
        ulNew.find("li").on('click', function(li) {
            if(!$(li.currentTarget).hasClass("disabled")){
                var value = $(li.currentTarget).text();
                if (value && value != moreSignal&&value !=">"&&value !="<") {
                    pagePlugin.index=value;
                    if(pagePlugin.callback){
                        pagePlugin.callback(pagePlugin.index);
                    }
                }
            }
        });
        $("#datatable_previous").on("click",function(){
            var currLi;
            if(event.target.tagName!="LI"){
                currLi=$(event.target).parent();
            }
            if(!currLi.hasClass("disabled")){
                pagePlugin.index=pagePlugin.index-1;
                if(pagePlugin.callback){
                    pagePlugin.callback(pagePlugin.index);
                }
            }
        });
        $("#datatable_next").on("click",function(){
            var currLi;
            if(event.target.tagName!="LI"){
                currLi=$(event.target).parent();
            }
            if(!currLi.hasClass("disabled")){
                pagePlugin.index=pagePlugin.index+1;
                if(pagePlugin.callback){
                    pagePlugin.callback(pagePlugin.index);
                }
            }
        });
    }
};