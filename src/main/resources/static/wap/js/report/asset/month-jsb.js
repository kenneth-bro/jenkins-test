//风险等级
var riskLevel = 1
//投资期限 1-短期（1年以下）、2-中期（1-3年）、3-长期（3年以上）
var investTerm = 1;
//用户自定义等级列表
var riskShowArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
//实际等级列表
var riskArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
//风险等级文字列表
var riskStrArr = ["低风险", "低风险", "低风险", "低中风险", "低中风险", "低中风险", "中风险", "中风险", "中风险", "中高风险", "中高风险", "中高风险", "高风险", "高风险", "高风险"];
//投资期限显示
var investTermShowArr = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3];
var investTermShowIndex=0;
//组合编号
var combinationIndex = 0;
//组合中文名
var combiantionIndexChinese = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五"];
//来源
var source = 2;
//拟投金额等级
var investNumLevel = 1;
$(function(){
	initParam();
	initEvent();
	loadData();
});

function initParam(){
	try {
		riskLevel = invest.func.getUrlParamer("riskLevel");
		//用户等级对应后台等级
		for(var i=0; i < riskShowArr.length; i++){
			if(riskShowArr[i] == riskLevel){
				riskLevel = riskArr[i];
				combinationIndex = i;
				investTermShowIndex = i;
				break;
			}
		}
	} catch (e) {
		console.log(e);
	}
}

function initEvent(){
	var showName = '阿尔法' + combiantionIndexChinese[combinationIndex] + '号';
	$(".showName").html(showName);
	$("#combinationIndex").html(combiantionIndexChinese[combinationIndex]);
	
	//收缩点击
	$(".click span").click(function(){
		var mark = $(this).attr("data-mark");
		if(mark == 0){
			//展开
			$(this).attr("data-mark", "1");
			$(this).children().removeClass("fa-angle-down").addClass("fa-angle-up");
			$(this).parent().parent().next().slideDown();
		}else{
			//收起
			$(this).attr("data-mark", "0");
			$(this).children().removeClass("fa-angle-up").addClass("fa-angle-down");
			$(this).parent().parent().next().slideUp();
		}
	});
	
	$(".click3 span").click(function(){
		var mark = $(this).attr("data-mark");
		if(mark == 0){
			//展开
			$(this).attr("data-mark", "1");
			$(this).children().removeClass("fa-angle-down").addClass("fa-angle-up");
			$(this).parent().parent().next().slideDown();
		}else{
			//收起
			$(this).attr("data-mark", "0");
			$(this).children().removeClass("fa-angle-up").addClass("fa-angle-down");
			$(this).parent().parent().next().slideUp();
		}
		$(this).unbind('click');
	});
	
	//分享点击
	$(".share").click(function(){
		location.href = "share.html?riskLevel=" + riskLevel + "&investTerm=" + investTerm;
	});
}

function loadData(){
	//收益概览
	getProfitInfo(riskLevel, investTerm, investNumLevel);
	
	//最新资产配置建议
	getConfigAdvise(riskLevel, investTerm, investNumLevel);
	
	//收益分析
	getProfitAnalysis(riskLevel, investTerm, investNumLevel);
	
	//随机话述
	getConclusion();
}

//收益概览
function getProfitInfo(riskLevel, investTerm, investNumLevel){
	dataAjax({"riskLevel": riskLevel, "investTerm": investTerm, "investNumLevel": investNumLevel, "source": source}, "/asset/report/profit", function(data, status){
		if(data.code == 202){
			data = data.data;
			//取第一条
			var result = data[0];
			//加载业绩基准 风险等级为1，投资期限随便
			dataAjax({"riskLevel": 1, "investTerm": investTerm, "source": source}, "/asset/report/profit", function(data2, status){
				if(data2.code = 202){
					data2 = data2.data;
					//取第一条为使用数据
					var result2 = data2[0];
					
					//投资期限
					var term =investTermShowArr[parseInt(investTermShowIndex)];
					var termStr = "";
					var termYearStr = "";
					if(riskLevel == 1 || riskLevel == 4 || riskLevel == 7 || riskLevel == 10 || riskLevel == 13){
						termStr = "短期";
						termYearStr = "1年以下";
					}else if(riskLevel == 2 || riskLevel == 5 || riskLevel == 8 || riskLevel == 11 || riskLevel == 14){
						termStr = "中期";
						termYearStr = "1-3年";
					}else if(riskLevel == 3 || riskLevel == 6 || riskLevel == 9 || riskLevel == 12 || riskLevel == 15){
						termStr = "长期";
						termYearStr = "3年以上";
					}
					
					//风险等级
					var risk = result.riskLevel;
					var riskStr = "";
					for(var i=0; i < riskArr.length; i++){
						if(risk == riskArr[i]){
							riskStr = riskStrArr[i];
							risk = riskShowArr[i];
							break;
						}
					}
					
					//拟投金额
					var money = 10000;
					money = money.formatMoney(2);
					
					//开始购买日期
					var beginDate = result.beginInvestDate.toString();
					beginDate = (new DateFormat("yyyyMMdd")).parse(beginDate);
					beginDate = (new DateFormat("yyyy年M月d日")).format(beginDate);
					
					//收益话述
					var words = result.combinationWords2;
					
					//组合累计收益和收益率
					var profit = result.totalProfit;
					profit = profit.formatMoney(2);
					var profitRate = result.totalProfitRate * 100;
					//现金宝累计收益和收益率
					var cashProfit = result.cashTotalProfit;
					cashProfit = cashProfit.formatMoney(2);
					var cashProfitRate = result.cashTotalProfitRate * 100;
					//沪深300累计收益和收益率
					var hs300Profit = result.hs300TotalProfit;
					hs300Profit = hs300Profit.formatMoney(2);
					var hs300ProfitRate = result.hs300TotalProfitRate * 100;
					//业绩基准累计收益和收益率
					var benchmarkProfit = result2.benchmarkTotalProfit;
					benchmarkProfit = benchmarkProfit.formatMoney(2);
					var benchmarkProfitRate = result2.benchmarkTotalProfitRate * 100;
					
					var showProfitName = '';
					var showProfit;
					var showProfitRate;
					if(false){
						//只pk业绩基准
						words = result.combinationWords1;
						showProfitName = '余额宝同期收益';
						showProfit = cashProfit;
						showProfitRate = cashProfitRate;
					}else{
						//只pk业绩基准
						words = result.combinationWords3;
						showProfitName = '业绩基准收益';
						showProfit = benchmarkProfit;
						showProfitRate = benchmarkProfitRate;
					}
					
					
					//本月收益、本月收益率和最新持仓市值
					var profitMonth = result.profitMonth;
					profitMonth = profitMonth.formatMoney(2);
					
					var profitRateMonth = result.profitRateMonth * 100;
					
					var latestValue = result.combinationValueLatest;
					latestValue = latestValue.formatMoney(2);
					
					//区间收益值
					var rate1y = result.totalProfitRate1Y * 100;
					rate1y = rate1y.toFixed(2);
					var rate6m = result.totalProfitRate6M * 100;
					rate6m = rate6m.toFixed(2);
					var rate3m = result.totalProfitRate3M * 100;
					rate3m = rate3m.toFixed(2);
					var rate1m = result.totalProfitRate1M * 100;
					rate1m = rate1m.toFixed(2);
					
					$("#trem").html('<i class="spe-text2">' + termStr +'</i>');
					$("#risk").html('<i class="spe-text2">' + riskStr +'</i>');
					$("#money").html('<i class="spe-text2">' + money +'</i>');
					$("#beginDate").html(beginDate);
					
					$("#profit").html(profit + '<span>元</span>');
					$("#profitRate").html(positiveNum(profitRate));
					
					$("#showProfitName").html(showProfitName);
					$("#showProfit").html(showProfit + '<span>元</span>');
					$("#showProfitRate").html(positiveNum(showProfitRate));
					
					$("#words1").html(words);
					
					$("#profitMonth").html(profitMonth);
					$("#profitRateMonth").html(positiveNum(profitRateMonth));
					$("#latestValue").html(latestValue);
					
					$("#rate1y").html(positiveNum(rate1y));
					$("#rate6m").html(positiveNum(rate6m));
					$("#rate3m").html(positiveNum(rate3m));
					$("#rate1m").html(positiveNum(rate1m));
					
				}
			});
		}
	});
}

//最新资产配置建议
function getConfigAdvise(riskLevel, investTerm, investNumLevel){
	dataAjax({"riskLevel": riskLevel, "investTerm": investTerm, "investNumLevel": investNumLevel, "source": source}, "/asset/report/configAdvise", function(data, status){
		if(data.code == 202){
			data = data.data;
			if(data.length == 0){
				$(".click1").hide();
				return;
			}
			//分类：股票类、黄金类、固收类、另类和现金
			var stockAdviseArr = [];
			var goldAdviseArr = [];
			var fixedAdviseArr = [];
			var qdiiAdviseArr = [];
			var cashAdviseArr = [];
			for(var i=0; i < data.length; i++){
				var assetType = data[i].assetType;
				if(assetType == 1){
					stockAdviseArr.push(data[i]);
				}else if(assetType == 2){
					fixedAdviseArr.push(data[i]);
				}else if(assetType == 3){
					goldAdviseArr.push(data[i]);
				}else if(assetType == 4){
					qdiiAdviseArr.push(data[i]);
				}else if(assetType == 5){
					cashAdviseArr.push(data[i]);
				}
			}
			
			//占比
			var stockAdviseRate = 0;
			var goldAdviseRate = 0;
			var fixedAdviseRate = 0;
			var qdiiAdviseRate = 0;
			var cashAdviseRate = 0;
			for(var i=0; i < stockAdviseArr.length; i++){
				stockAdviseRate += stockAdviseArr[i].allotRate;
			}
			for(var i=0; i < goldAdviseArr.length; i++){
				goldAdviseRate += goldAdviseArr[i].allotRate;
			}
			for(var i=0; i < fixedAdviseArr.length; i++){
				fixedAdviseRate += fixedAdviseArr[i].allotRate;
			}
			for(var i=0; i < qdiiAdviseArr.length; i++){
				qdiiAdviseRate += qdiiAdviseArr[i].allotRate;
			}
			for(var i=0; i < cashAdviseArr.length; i++){
				cashAdviseRate += cashAdviseArr[i].allotRate;
			}
			
			stockAdviseRate = stockAdviseRate * 100;
			stockAdviseRate = stockAdviseRate.toFixed(2);
			goldAdviseRate = goldAdviseRate * 100;
			goldAdviseRate = goldAdviseRate.toFixed(2);
			fixedAdviseRate = fixedAdviseRate * 100;
			fixedAdviseRate = fixedAdviseRate.toFixed(2);
			qdiiAdviseRate = qdiiAdviseRate * 100;
			qdiiAdviseRate = qdiiAdviseRate.toFixed(2);
			cashAdviseRate = cashAdviseRate * 100;
			cashAdviseRate = cashAdviseRate.toFixed(2);
			
			//表格
			var info = "";
			//股票类
			if(stockAdviseArr.length > 0){
				info += '<div class="chart1-table-r">'+
								'<div class="chart1-table-h">'+
							    	'<span class="chart1-table-t1">偏股类</span>'+
								    '<span class="chart1-table-t2">占比<i class="red">' + positiveNum(stockAdviseRate) +'</i></span>'+
							    '</div>'+
								'<div class="chart1-table-d">';
					
				for(var i=0; i < stockAdviseArr.length; i++){
					var subName = stockAdviseArr[i].fundName;
					var subCode = stockAdviseArr[i].fundCode;
					var subRate = stockAdviseArr[i].allotRate * 100;
					subRate = subRate.toFixed(2);
					info += 	'<div>'+
										'<span class="chart1-table-d1">' + subName +'（' + subCode +'）</span> '+
										'<span class="chart1-table-d2">' + subRate +'%</span>'+
									'</div>';
				}
				info +=		'</div>'+
							'</div>';
			}
			
			//固收类
			if(fixedAdviseArr.length > 0){
				info += '<div class="chart1-table-r">'+
								'<div class="chart1-table-h">'+
							    	'<span class="chart1-table-t1">偏债类</span>'+
								    '<span class="chart1-table-t2">占比<i class="red">' + positiveNum(fixedAdviseRate) +'</i></span>'+
							    '</div>'+
								'<div class="chart1-table-d">';
					
				for(var i=0; i < fixedAdviseArr.length; i++){
					var subName = fixedAdviseArr[i].fundName;
					var subCode = fixedAdviseArr[i].fundCode;
					var subRate = fixedAdviseArr[i].allotRate * 100;
					subRate = subRate.toFixed(2);
					info += 	'<div>'+
										'<span class="chart1-table-d1">' + subName +'（' + subCode +'）</span> '+
										'<span class="chart1-table-d2">' + subRate +'%</span>'+
									'</div>';
				}
				info +=		'</div>'+
							'</div>';
			}
			
			//黄金类
			if(goldAdviseArr.length > 0){
				info += '<div class="chart1-table-r">'+
								'<div class="chart1-table-h">'+
							    	'<span class="chart1-table-t1">黄金类</span>'+
								    '<span class="chart1-table-t2">占比<i class="red">' + positiveNum(goldAdviseRate) +'</i></span>'+
							    '</div>'+
								'<div class="chart1-table-d">';
					
				for(var i=0; i < goldAdviseArr.length; i++){
					var subName = goldAdviseArr[i].fundName;
					var subCode = goldAdviseArr[i].fundCode;
					var subRate = goldAdviseArr[i].allotRate * 100;
					subRate = subRate.toFixed(2);
					info += 	'<div>'+
										'<span class="chart1-table-d1">' + subName +'（' + subCode +'）</span> '+
										'<span class="chart1-table-d2">' + subRate +'%</span>'+
									'</div>';
				}
				info +=		'</div>'+
							'</div>';
			}
			
			//另类
			if(qdiiAdviseArr.length > 0){
				info += '<div class="chart1-table-r">'+
								'<div class="chart1-table-h">'+
							    	'<span class="chart1-table-t1">另类</span>'+
								    '<span class="chart1-table-t2">占比<i class="red">' + positiveNum(qdiiAdviseRate) +'</i></span>'+
							    '</div>'+
								'<div class="chart1-table-d">';
					
				for(var i=0; i < qdiiAdviseArr.length; i++){
					var subName = qdiiAdviseArr[i].fundName;
					var subCode = qdiiAdviseArr[i].fundCode;
					var subRate = qdiiAdviseArr[i].allotRate * 100;
					subRate = subRate.toFixed(2);
					info += 	'<div>'+
										'<span class="chart1-table-d1">' + subName +'（' + subCode +'）</span> '+
										'<span class="chart1-table-d2">' + subRate +'%</span>'+
									'</div>';
				}
				info +=		'</div>'+
							'</div>';
			}
			
			//现金类
			if(cashAdviseArr.length > 0){
				info += '<div class="chart1-table-r">'+
								'<div class="chart1-table-h">'+
							    	'<span class="chart1-table-t1">货币类</span>'+
								    '<span class="chart1-table-t2">占比<i class="red">' + positiveNum(cashAdviseRate) +'</i></span>'+
							    '</div>'+
								'<div class="chart1-table-d">';
					
				for(var i=0; i < cashAdviseArr.length; i++){
					var subName = cashAdviseArr[i].fundName;
					var subCode = cashAdviseArr[i].fundCode;
					var subRate = cashAdviseArr[i].allotRate * 100;
					subRate = subRate.toFixed(2);
					info += 	'<div>'+
										'<span class="chart1-table-d1">' + subName +'（' + subCode +'）</span> '+
										'<span class="chart1-table-d2">' + subRate +'%</span>'+
									'</div>';
				}
				info +=		'</div>'+
							'</div>';
			}
			
			$("#configAdviseTable").html(info);
			
			//绘制占比图
			$("#configAdviseChart").width($(".content2").width());
			$("#configAdviseChart").highcharts({
		        chart: {
		            plotBackgroundColor: null,
		            plotBorderWidth: null,
		            plotShadow: false,
		            spacing: [10, 0, 10, 0],
		            height: 160,
		            style : {  
		                    fontSize:'12px',  
		                    fontWeight:'bold',
		                    fontFamily: 'SF Pro Text'
		                } 
		        },
		        legend: {
		        	useHTML: true,
		            layout: 'vertical',  
		            itemMarginBottom: 5, 
		            backgroundColor: '#ffffff',
		            align: 'right',
		            verticalAlign: 'top',
		            maxHeight: 200,		    
		            x: -15,
		            y: 10,
		            symbolHeight: 10,
		            symbolWidth: 10,
		            symbolRadius: .5,
		            symbolPadding: 15,
		            itemStyle: {
		                color: '#888888',
		                fontSize: 11,
		            },
		            labelFormatter: function () {  
		                return this.name + '  &nbsp;&nbsp;  ' + this.percentage.toFixed(2) +'%';  //在名称后面追加百分比数据  
		            }  
		        },
		        credits: {
		            enabled: false
		        },
		        exporting: {
		            enabled: false
		        },
		        title: {    
		            text: null,
		        },
		        plotOptions: {
		            pie: {
		                allowPointSelect: false,
		                cursor: 'pointer',
		                borderWidth: 0,
		                dataLabels: {
		                    enabled: false
		                },
		                showInLegend: true,
		                point : {
		                    events : {
		                        legendItemClick: function() {
		                            return false;
		                        }
		                    }
		                }
		            }
		        },
		        series: [{
		            type: 'pie',
		            size: '90%',
		            innerSize: '75%',
		            name: '市场份额',
		            colors: ['#fe4545', '#ffa720', '#ffcd2f', '#91d756', '#458bfe'] ,
		            data: [
		                {
		                	name:'偏股类',  
		                    y:  parseFloat(stockAdviseRate),
		                },{
		                	name:'偏债类',  
		                    y:  parseFloat(fixedAdviseRate),
		                },{
		                	name:'黄金类',  
		                    y:  parseFloat(goldAdviseRate),
		                },{
		                	name:'另&nbsp;&nbsp;&nbsp;&nbsp;类',  
		                    y:  parseFloat(qdiiAdviseRate),
		                },{
		                	name:'货币类', 
		                    y:  parseFloat(cashAdviseRate),
		                }
		            ],
		            states: {
		                //图表无扩散阴影
		                hover: {
		                    enabled: false
		                }
		            }
		            
		        }],
		        tooltip: {
		            enabled: false
		        }
		    });
			
			
		}
	})
}

//收益分析
function getProfitAnalysis(riskLevel, investTerm, investNumLevel){
	dataAjax({"riskLevel": riskLevel, "investTerm": investTerm, "investNumLevel": investNumLevel, "source": source}, "/asset/report/profitAnalysis", function(data, status){
		if(data.code == 202){
			data = data.data;
			//取第一条
			var result = data[0];
			
			//发布日期
			var pubDate = result.pubDate.toString();
			pubDate = (new DateFormat("yyyyMMdd")).parse(pubDate);
			pubDate = (new DateFormat("yyyy-MM-dd")).format(pubDate);
			
			//话述
			var words = result.words;
			var tempWords = words;
			//以 </i>先拆分，看看有多少个
			var handleSplit = [];
			var splitis = words.split("</i>");
			for(var i=0; i < splitis.length - 1; i++){
				//截取第一个<i>和第一个</i>
				var specialText = tempWords.substring(tempWords.indexOf("<i>") + 3, tempWords.indexOf("</i>"));
				tempWords = tempWords.substring(tempWords.indexOf("</i>") + 3, tempWords.length);
				handleSplit.push(specialText);
			}
			//替换字符串中的%为空和将标签i替换为空
			words = words.replace(/%/g, "");
			words = words.replace(/<i>/g, "");
			words = words.replace(/<\/i>/g, "");
			//处理后的数据
			var handleWords = [];
			var tempWords2 = words;
			for(var i=0; i < handleSplit.length; i++){
				var subSplit = handleSplit[i];
				//含有%为百分比-放大变色
				if(subSplit.indexOf('%') != -1){
					subSplit = subSplit.replace('%', "");
					var rateNum = parseFloat(subSplit);
					var rateNumStr = '';
					if(rateNum >= 0){
						rateNumStr = '<span class="spe-text-red">' + rateNum.toFixed(2) +'%</span>';
					}else{
						rateNumStr = '<span class="spe-text-red spe-text-green">' + rateNum.toFixed(2) +'%</span>';
					}
					//以不同的数字进行截取
					var words1 = tempWords2.substring(0, tempWords2.indexOf(subSplit) + subSplit.length);
					var words2 = tempWords2.substring(tempWords2.indexOf(subSplit) + subSplit.length, tempWords2.length);
					words1 = words1.replace(subSplit, rateNumStr);
					handleWords.push(words1);
					tempWords2 = words2;
					//如果为最后一个，需要把words2加入集合中
					if(i == handleSplit.length - 1){
						handleWords.push(words2);
					}
					
				}else if(/\d/gi.test(subSplit)){
					//纯数字为金额-放大变色
					var num = parseFloat(subSplit);
					var numStr = '';
					if(num >= 0){
						numStr = '<span class="spe-text-red">' + num.formatMoney(2) +'</span>';
					}else{
						numStr = '<span class="spe-text-red spe-text-green">' + num.formatMoney(2) +'</span>';
					}
					//以不同的数字进行截取
					var words1 = tempWords2.substring(0, tempWords2.indexOf(subSplit) + subSplit.length);
					var words2 = tempWords2.substring(tempWords2.indexOf(subSplit) + subSplit.length, tempWords2.length);
					words1 = words1.replace(subSplit, numStr);
					handleWords.push(words1);
					tempWords2 = words2;
					//如果为最后一个，需要把words2加入集合中
					if(i == handleSplit.length - 1){
						handleWords.push(words2);
					}
					
				}else{
					//中文-放大加粗
					var chinese = subSplit;
					var chineseStr = '<span class="spe-text-chinese">' + chinese +'</span>';
					//以不同的数字进行截取
					var words1 = tempWords2.substring(0, tempWords2.indexOf(subSplit) + subSplit.length);
					var words2 = tempWords2.substring(tempWords2.indexOf(subSplit) + subSplit.length, tempWords2.length);
					words1 = words1.replace(chinese, chineseStr);
					handleWords.push(words1);
					tempWords2 = words2;
					//如果为最后一个，需要把words2加入集合中
					if(i == handleSplit.length - 1){
						handleWords.push(words2);
					}
				}
			}
			
			var showWords = '';
			for(var i=0; i < handleWords.length; i++){
				showWords += handleWords[i];
			}
			//资产收益分布
			var stockProfit = result.stockProfitLossMoney;
			var goldProfit = result.goldProfitLossMoney;
			var fixedProfit = result.fixedProfitLossMoney;
			var qdiiProfit = result.qdiiProfitLossMoney;
			var currencyProfit = result.currencyPorfitLossMoney;
			
			$("#analysisDate").html('数据截止至：' + pubDate);
			$("#words").html(showWords);
			
			var maxvalue = Math.max(stockProfit, goldProfit, fixedProfit, qdiiProfit, currencyProfit);
			var minvalue = Math.min(stockProfit, goldProfit, fixedProfit, qdiiProfit, currencyProfit);
			
			// y 轴的最大最小值
			var scale = Math.abs(maxvalue/minvalue);
			if(scale >= 10){
				maxvalue = maxvalue*1.4;
				minvalue = minvalue*3.6;
			}else if(scale >=5){
				maxvalue = maxvalue*1.4;
				minvalue = minvalue*2.8;
			}else if(scale >=3){
				maxvalue = maxvalue*1.4;
				minvalue = minvalue*2.5;
			}else if(scale >=2){
				maxvalue = maxvalue*1.4;
				minvalue = minvalue*2.1;
			}else if(scale >=1){
				maxvalue = maxvalue*1.4;
				minvalue = minvalue*1.4;
			}else if(scale >= 0.5){
				maxvalue = maxvalue*2.1;
				minvalue = minvalue*1.4;
			}else if(scale >= 0.3333){
				maxvalue = maxvalue*2.5;
				minvalue = minvalue*1.4;
			}else if(scale >= 0.2){
				maxvalue = maxvalue*2.8;
				minvalue = minvalue*1.4;
			}else{
				maxvalue = maxvalue*3.6;
				minvalue = minvalue*1.4;
			};
			//资产分布图
			$('#assetCollatChart').highcharts({
		        chart: {
		            type: 'column',
		            inverted: true,
		            height: 180,
		            spacing: [10, 10, 5, 10],
		            style : {  
	                    fontSize:'12px',  
	                    fontFamily: 'SF Pro Text'
	                } 
		        },
		        title: {
		            text: null
		        },
		        legend: {
		        	enabled: false
		        },
		        xAxis: {
		            categories: ['偏股类', '偏债类', '黄金类', '另类', '货币类'],
		            gridLineWidth: 0,
		            tickWidth:0,    //设置刻度标签宽度
		            lineColor:'#FFFFFF',
		            labels:{
		                enabled:true //设置刻度是否显示
		            }
		        },
		        yAxis: {
		        	visible: false,
		        	max: maxvalue,
		        	min: minvalue
		        },
		        credits: {
		            enabled: false
		        },
		        exporting: {
		            enabled: false
		        },
		        plotOptions: {
		            column: {
		                allowPointSelect: false,
		                borderWidth: 0,
		                dataLabels: {
		                    enabled: true,
		                    style: {
		                    	fontWeight: '300',
			                    fontSize: '12px',
			                    color: '#888888'
			                },
			                formatter: function() { 
			                 	var num = this.y;
			                 	if (num > 0) {
			                 		return '+' + parseFloat(num).toFixed(2);
			                 	}else {
			                 		return parseFloat(num).toFixed(2);
			                 	}
							 }   
		                },
		                showInLegend: true,
		                point : {
		                    events : {
		                        legendItemClick: function() {
		                            return false;
		                        }
		                    }
		                }
		            }
		        },
		        tooltip: {
		        	enabled: false
		        },
		        series: [{
		        	data: [
		                {'color':'#e63838','y':stockProfit},
		                {'color':'#ffcd2f','y':fixedProfit},
		                {'color':'#ffa720','y':goldProfit},
		                {'color':'#01b500','y':qdiiProfit},
		                {'color':'#3388ff','y':currencyProfit}
		        	]    	           
		        }]
		    });
			
		}
	})
}

/**
 * 结论性的话述
 */
function getConclusion(){
	dataAjax({"source": source}, "/asset/report/conclusion", function(data, status){
		if(data.code == 202){
			data = data.data;
			var result = data[0];
			var words = result.wordsContent;
			$("#conclusionWords").html('"' + words +'"')
		}
	});
}


/**
 * 正负数据处理
 */
function positiveNum(num){
    var info = '';
    try {
        var n = parseFloat(num);
        if(n > 0){
            info = '<span style="color:#e63838;">+' + n.formatMoney(2) +'%</span>';
        }else if(n < 0){
            info = '<span style="color:#49B745;">' + n.formatMoney(2) +'%</span>'
        }else if(n == 0){
            info = '<span>' + n.formatMoney(2) +'%</span>'
        }
    } catch (e) {
        info = '<span>' + num +'</span>'
    }
    return info;
}