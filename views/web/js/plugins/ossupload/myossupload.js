// ================================================================
//  author:文霞
//  createDate: 2017/05/04
//  description: 根据实际业务封装的ossupload插件
//  ===============================================================
"use strict";
define(['jquery', 'underscore','base64','plupload'],
    function ($, _) {
        var accessid= 'LTAIxU6gGmQxNT49';
        var accesskey= '9PgE5Ulkxb6v8bbnWSuugbvmtKfxhb';
        var host = 'http://qhpg.oss-cn-qingdao.aliyuncs.com';
        var myOssupload = {
//            accessid:'LTAIxU6gGmQxNT49',
//            accesskey:'9PgE5Ulkxb6v8bbnWSuugbvmtKfxhb',
//            host:'http://qhpg.oss-cn-qingdao.aliyuncs.com',
            createUploader:function(uploadoption){
                var g_dirname = uploadoption.g_dirname;
                var g_object_name = '';
                var g_object_name_type = uploadoption.g_object_name_type;
//                var now = timestamp = Date.parse(new Date()) / 1000;

                var policyText = {
                    "expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
                    "conditions": [
                        ["content-length-range", 0, 5048576000] // 设置上传文件的大小限制5G大概
                    ]
                };
                var policyBase64 = Base64.encode(JSON.stringify(policyText));
                var message = policyBase64;
                var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true }) ;
                var signature = Crypto.util.bytesToBase64(bytes);

                var set_upload_param=function(up, filename, ret){
                        g_object_name = g_dirname;
                        if (filename != '') {
                            var suffix = get_suffix(filename);
                            calculate_object_name(filename)
                        }
                        var new_multipart_params = {
                            'key' : g_object_name,
                            'policy': policyBase64,
                            'OSSAccessKeyId': accessid,
                            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
                            'signature': signature
                        };

                        up.setOption({
                            'url': host,
                            'multipart_params': new_multipart_params
                        });
                        up.start();
                    },
                    random_string=function(len){
                        len = len || 32;
                        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
                        var maxPos = chars.length;
                        var pwd = '';
                        for (var i = 0; i < len; i++) {
                            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
                        }
                        return pwd;
                    },
                    get_suffix=function(filename){
                        var pos = filename.lastIndexOf('.');
                        var suffix = '';
                        if (pos != -1) {
                            suffix = filename.substring(pos)
                        }
                        return suffix;
                    },
                    calculate_object_name=function(filename){
                        if (g_object_name_type == 'local_name')
                        {
                            g_object_name += "${filename}"
                        }
                        else if (g_object_name_type == 'random_name')
                        {
                            var suffix = get_suffix(filename);
                            g_object_name = g_dirname + random_string(10) + suffix
                        }
                        return ''
                    },
                    get_uploaded_object_name=function(filename){
                        if (g_object_name_type == 'local_name')
                        {
                            var tmp_name = g_object_name;
                            tmp_name = tmp_name.replace("${filename}", filename);
                            return tmp_name
                        }
                        else if(g_object_name_type == 'random_name')
                        {
                            return g_object_name
                        }
                    };
                var uploader = new plupload.Uploader({
                    runtimes : 'html5,flash,silverlight,html4',
                    browse_button : uploadoption.choosebtn,
                    multi_selection: false,
                    container: document.getElementById(uploadoption.container),
                    flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
                    silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
                    url : 'http://oss.aliyuncs.com',
                    init: {
                        PostInit: function() {
                            var uploadbtnid=uploadoption.uploadbtn;
                            if(uploadbtnid){
                                document.getElementById(uploadbtnid).onclick = function() {
                                    set_upload_param(uploader, '', false);
                                    return false;
                                };
                            }
                        },
                        FilesAdded: function(up, files) {
                            plupload.each(files, function(file) {
                                var sizev=plupload.formatSize(file.size);
                                //上传中方法加进度条
                                var ossfiledivid=uploadoption.ossfile;
                                if(uploadoption.type!="file"){  //图片上传
                                    //如果是图片上传,不用确认按钮直接执行上传
                                    set_upload_param(uploader, '', false);
                                }else if(uploadoption.type=="file"&&uploadoption.multiple){//多个文件上传
                                    var fileName=file.name.length>25?file.name.substring(0,24)+'...':file.name;
                                    document.getElementById(ossfiledivid).innerHTML += '<div id="' + file.id + '" filename="'+file.name+'" filesize="'+sizev+'" title="'+file.name+'"><span>' + fileName + ' (' + sizev + ')</span><b></b><span><a class="layui-btn layui-btn-small deletefile"><i class="layui-icon"></i> 删除</a> </span>'
                                        +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
                                        +'</div>';
                                }else{//单个文件上传
                                    //删除uploader中的file对象
                                    if($("#ossfile2>div").length!=0){
                                        var fileid = $("#ossfile2>div")[0].id;//file.id;
                                        uploader.removeFile(fileid);
                                    }
                                    var fileName=file.name.length>25?file.name.substring(0,24)+'...':file.name;
                                    document.getElementById(ossfiledivid).innerHTML = '<div id="' + file.id + '" filename="'+file.name+'" filesize="'+sizev+'" title="'+file.name+'"><span>' + fileName + ' (' + sizev + ')</span><b></b><span><a class="layui-btn layui-btn-small deletefile"><i class="layui-icon"></i> 删除</a> </span>'
                                        +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
                                        +'</div>';
                                    //单个文件上传没有确认上传按钮，直接上传
                                    set_upload_param(uploader, '', false);
                                }
                            });
                        },
                        BeforeUpload: function(up, file) {
                            set_upload_param(up, file.name, true);
                        },
                        UploadProgress: function(up, file) {
                            //只有需要显示进度条的地方这个才执行
                            if(uploadoption.type=="file") {
                                var d = document.getElementById(file.id);
//                                d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + '%</span><a class="layui-btn layui-btn-small deletefile" fileid="' + file.id + '"><i class="layui-icon"></i> 删除</a>';
                                d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + '%</span>';
                                var prog = d.getElementsByTagName('div')[0];
                                var progBar = prog.getElementsByTagName('div')[0];
                                progBar.style.width = 2 * file.percent + 'px';
                                progBar.setAttribute('aria-valuenow', file.percent);
                            }else{
                                $(".layui-progress").show();
                                $(".layui-progress-bar")[0].style.width = 2 * file.percent + 'px';
                                $(".layui-progress-bar")[0].setAttribute('lay-percent', file.percent);
                                $(".layui-progress-text").html(2 * file.percent + 'px');
                            }
                        },
                        FileUploaded: function(up, file, info) {
                            if (info.status == 200)
                            {
                                var filesrc=host + "/" + get_uploaded_object_name(file.name);
                                //上传成功之后的方法
                                if(uploadoption.type=="head"){
                                    $(".layui-progress").hide();
                                    var ossfiledivid=uploadoption.ossfile;
                                    document.getElementById(ossfiledivid).src=filesrc;
                                }else if(uploadoption.type=="img"){
                                    $(".layui-progress").hide();
                                    var ossfiledivid=uploadoption.ossfile;
                                    $("#"+ossfiledivid).append(" <div class=\"layui-inline\"><img  src=\""+filesrc+"\"></div>");
                                }else {
                                    $("#" + file.id).attr("fileurl", filesrc);
                                }
                            }
                            else
                            {
                                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                            }
                        },
                        Error: function(up, err) {
                            document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
                        }
                    }

                });
                //注册删除按钮的点击事件
                if(uploadoption.type=="file") {
                    $('#'+uploadoption.ossfile).delegate('.deletefile','click',function(){
                        var fileBlock=  (event.target.tagName=='I'?event.target.parentNode.parentNode.parentNode:event.target.parentNode.parentNode);
                        var fileid=fileBlock.id;
                        //删除dom节点
                        fileBlock.remove();

                        //删除uploader中的file对象
                        uploader.removeFile(fileid);
                    })
                }
                return uploader;
            }
        };
        return myOssupload;
    }
);