$(function(){
	initParam();
	initEvent();
	loadData();
});

function initParam(){
	try {
		riskLevel = invest.func.getUrlParamer("riskLevel");
		investTerm = invest.func.getUrlParamer("investTerm");
	} catch (e) {
		console.log(e);
	}
}

function initEvent(){
	
}

function loadData(){
	//收益概览
	getProfitInfo(riskLevel, investTerm);
}

//收益概览
function getProfitInfo(riskLevel, investTerm, investNum){
	var riskArr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
	var riskStrArr = ["低风险", "低风险", "低风险", "中风险", "中风险", "中风险", "中风险", "高风险", "高风险", "高风险"];
	dataAjax({"riskLevel": riskLevel, "investTerm": investTerm}, "/asset/report/profit", function(data, status){
		if(data.code == 202){
			data = data.data;
			//取第一条
			var result = data[0];
			
			//开始购买日期
			var beginDate = result.beginInvestDate.toString();
			beginDate = (new DateFormat("yyyyMMdd")).parse(beginDate);
			beginDate = (new DateFormat("yyyy年M月d日")).format(beginDate);
			
			//组合累计收益和收益率
			var profit = result.totalProfit;
			profit = profit.formatMoney(2);
			var profitRate = result.totalProfitRate * 100;
			

			
			$("#beginDate").html(beginDate + '至今');
			$("#profit").html(profit + "元");
			
		}
	});
}

//返回
function back(){
	location.href = "month.html?riskLevel=" + riskLevel + "&investTerm=" + investTerm;
}