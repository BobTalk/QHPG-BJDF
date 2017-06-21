// ================================================================
//  author:wenxia
//  createDate: 2017/4/26.
//  description: 清华评估-数据图表设置
//  ===============================================================
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/demo/ChartsSetting.html'),
        template = _.template(tpl), _this;
    var echarts=require('echarts');
    require('macarons');
    return Backbone.View.extend({
        className: "layui-main",
        initialize: function () {
            _this = this;
            this.render();
        },
        render: function () {
            this.$el.html(template(this.model));
            return this;
        },
        afterRender: function () {
            layui.use(['form'], function(){
            });

//            layui.use(['form','element'], function(){
//            });
//            var form = layui.form();
//            form.render();
            var me=this;
            me.drawCharts();
        },
        events: {
            "click #refreshChart":"drawCharts",
            "click .addRow":"addRow",
            "click #addSeries":"addSeries"
        },
        addRow:function(){//添加行
            var currentTable=$(event.target).parents('.series-wrapper').find("table");
            var trEx=currentTable.find('tbody').find('tr:first');
            var trCopy=trEx.clone();
            trCopy.find('input').val("");
            currentTable.find('tbody').append(trCopy);
        },
        addSeries:function(){//添加数据系列
            var seriesList=$(".series-wrapper");
            var seriesCopy=$(seriesList[0]).clone();
            $("#dataWrapper").append(seriesCopy);
        },
        drawCharts:function(){
            //获取标题设置
            var mainTitle=$("#main-title").val();
            var subTitle=$("#sub-title").val();

            //获取图表类型设置
            var chartType=$("input[name='chartType']:checked").val();//$("input[name='chartType']").val();
//            console.log(chartType);
//            var chartType=$('#chartTypeGroup .layui-form-radioed').prev('input').val()||$("input[name='chartType']").val();

            //获取数据设置
            var series=[];//最后的数据集
            var seriesNameList=[];
            var xAxisList=[];
            var tableList=$("#dataWrapper table");
            for(var j=0;j<tableList.length;j++){
                var currentTable=$(tableList[j]);
                var tableRowList=currentTable.find("tbody tr");//$("#chartData1 tbody tr");
                var dataResult=[];
                var seriesName=currentTable.parents('.series-wrapper').find('.series-name').val();//$("#"+currentTable.attr("data-series-input-id")).val();
                for(var i=0;i<tableRowList.length;i++){
                    var seriesEl=[];
                    var col1_value=$(tableRowList[i]).find("td input[name='col1']").val();
                    var col2_value=$(tableRowList[i]).find("td input[name='col2']").val();

                    if(xAxisList.indexOf(col1_value)==-1){
                        xAxisList.push(col1_value);
                    }

                    seriesEl.push(col1_value);
                    seriesEl.push(col2_value);

                    dataResult.push(seriesEl);
                }
                seriesNameList.push(seriesName);
                var seriesEl1={
                    name:seriesName,//'数值',//value,//系列名称
                    type:chartType,//'bar',//'line',

                    label:{
                        normal:{
                            show: true,
                            position: 'top'//,
//                            formatter: '{b}:{c}'
                        }
                    },
                    data:dataResult
                };
                series.push(seriesEl1);
            }


            var myChart = echarts.init(document.getElementById('canvasDiv'),'macarons');
            var option ={
                title : {//标题配置
                    text: mainTitle,// '原数据重组显示图表',
                    subtext: subTitle//'纯属虚构'
                },
                legend:{
                    data:seriesNameList
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                toolbox:{
                    show:true,
                    feature:{
                        saveAsImage : {show: true}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : xAxisList//xAxisList//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : series
            };
            myChart.setOption(option);
        }
    });
});
