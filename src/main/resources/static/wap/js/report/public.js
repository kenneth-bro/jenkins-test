/**
 * 数据加载
 * --- 使用前引用AppUtil.js
 * version: 1.0
 * · 通过APIGateway调取接口数据
 */

//加载数据模块
/**
 * 参数说明：
 * 		pageApiPrefix		页面应用调用本地接口地址前缀
 * 		pageUseApi			页面应用调用本地接口是否使用APIGateway
 * 		pageApiSuffix		页面应用调用本地接口地址后缀
 * 		useApi			是否使用APIGateway，如果后端接口使用API进行转发，设置为true
 * 		apiPrefix		API前缀，APIGateway配置的转发的应用的标识码
 * 		apiSuffix		API后缀，应用服务接口对应的请求链接
 */
investCustOptions = [{
	pageUseApi: false,
	pageApiPrefix: "",
	pageApiSuffix: "/request/api",
	useApi: false,
	apiPrefix: "",
	apiSuffix: "",
	ajaxAsync: true,
	ajaxIsLoadBeforeFunc: true,
	ajaxIsLoadCompleteFunc: true
},{
	//同步
	pageUseApi: false,
	pageApiPrefix: "",
	pageApiSuffix: "/request/api",
	useApi: false,
	apiPrefix: "",
	apiSuffix: "",
	ajaxAsync: false,
	ajaxIsLoadBeforeFunc: true,
	ajaxIsLoadCompleteFunc: true
}, {
	//异步-请求外部资源
	pageUseApi : false,
	pageApiPrefix : "",
	pageApiSuffix : "/request/extra",
	useApi : false,
	apiPrefix : "",
	apiSuffix : "",
	ajaxAsync : true,
	ajaxIsLoadBeforeFunc : true,
	ajaxIsLoadCompleteFunc : true
}, {
	//同步-请求外部资源
	pageUseApi : false,
	pageApiPrefix : "",
	pageApiSuffix : "/request/extra",
	useApi : false,
	apiPrefix : "",
	apiSuffix : "",
	ajaxAsync : false,
	ajaxIsLoadBeforeFunc : true,
	ajaxIsLoadCompleteFunc : true
}]

/**
 * 发起Ajax请求
 * 	参数说明：
 * 		params		请求参数
 * 		requestApiURL		请求地址
 * 		success	请求成功的回调函数
 * 		requestOption		请求地址配置，默认值为 invest.cust.ajax.options[0]
 */
function dataAjax(params, requestApiURL,	success,	requestOption){
	if(requestApiURL == undefined || requestApiURL == ""){
		console.log("请求地址为空，请检查。");
		return;
	}
	//默认值为配置第一项
	if(requestOption == undefined){
		requestOption = 0;
	}
	
	//根据配置获取最终的请求链接地址
	var custOption = {};
	try {
		custOption = investCustOptions[requestOption];
	} catch (e) {
		console.log("配置参数有误，请检查");
		return;
	}
	//本地请求参数、API请求参数、本地请求链接、API请求链接
	var localPram,apiParam,localURL,apiURL;
	if(custOption.pageUseApi){
		localURL = custOption.pageApiPrefix + custOption.pageApiSuffix;
	}else{
		localURL = custOption.pageApiSuffix;
	}
	
	if(custOption.useApi){
		apiURL = custOption.apiPrefix + custOption.apiSuffix + requestApiURL;
	}else{
		apiURL = custOption.apiSuffix + requestApiURL;
	}
	
	//合并参数
	var o1 = {page: apiURL};
	// 为了兼容，使用jquery的合并对象
	$.extend(params, o1);
	
	toLoadAjax(params, localURL, custOption, success);
}

/**
 * 根据处理信息加载ajax数据
 */
function toLoadAjax(params, localURL, custOption, success){
	var isAsync = custOption.ajaxAsync;
	if(isAsync == undefined){
		isAsync = true;
	}
	var id = (new Date()).getTime();
	var opt = {
			async : isAsync,
			url: localURL,
			data: params,
			type: "GET",
			dataType: "text",
			context: document.body,
			dataFilter: function(data, type){
				var dataText = data;
				var result = data;
				result = {"code": 201, "data": result};
				if(dataText.indexOf("{") != -1 || dataText.indexOf("[") != -1){
					result = $.parseJSON(data);
					result = {"code": 202, "data": result};
				}
				if(dataText == "" || dataText == null || dataText == "null"){
					result = {"code": 203, "message": "无数据"};
				}
				return result;
			},
			beforeSend: function(){
				if(custOption.ajaxIsLoadBeforeFunc){
					invest.func.loading(id);
				}
			},
			complete: function(){
				if(custOption.ajaxIsLoadCompleteFunc){
					invest.func.loadingStop(id);
				}
			},
			success: function(data, status){
				try {
					success(data, status);
				} catch (e) {
					console.error(e);
					if(custOption.ajaxIsLoadCompleteFunc){
						invest.func.loadingStop(id);
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				invest.func.loadingStop(id);
			}
	}
	
	if(opt == undefined || opt == null || opt == ""){
		console.log("请检查请求配置.");
	}else{
		$.ajax(opt);
	}
}

